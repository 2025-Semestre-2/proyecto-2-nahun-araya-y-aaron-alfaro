require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getPool, sql } = require("./db");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "..")));
app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query("SELECT DB_NAME() AS db");
    res.json({ ok: true, db: r.recordset[0].db });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/hoteles", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT *
      FROM dbo.vw_Hoteles_Buscador
      ORDER BY nombre
    `);
    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// helper: normaliza teléfono "+506 6308 4229" => "+50663084229"
function normalizarLogin(login) {
  return (login || "").replace(/\s+/g, "").trim();
}

/**
 * LOGIN (admin o cliente)
 * body: { username, password }
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const username = normalizarLogin(req.body.username);
    const password = (req.body.password || "").trim();
    if (!username || !password) return res.status(400).json({ ok: false, error: "Faltan datos" });

    const pool = await getPool();

    // 1) ADMIN (lo dejás igual por ahora)
    {
      const r = await pool.request()
        .input("usuario", sql.NVarChar(120), username)
        .input("password", sql.NVarChar(200), password)
        .execute("dbo.sp_LoginAdminWeb");

      const ok = r.recordset?.[0]?.ok === 1;
      if (ok) return res.json({ ok: true, role: "admin", idAdmin: r.recordset[0].idAdmin });
    }

    // 2) CLIENTE (bcrypt)
    {
      const r = await pool.request()
        .input("login", sql.NVarChar(120), username)
        .execute("dbo.sp_LoginClienteWeb"); 

      const row = r.recordset?.[0];
      if (!row?.idCliente || !row?.passwordHash) {
        return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
      }

      const ok = await bcrypt.compare(password, row.passwordHash);
      if (!ok) return res.status(401).json({ ok: false, error: "Credenciales inválidas" });

      return res.json({ ok: true, role: "cliente", idCliente: row.idCliente });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * REGISTRO CLIENTE
 */
app.post("/api/auth/register/cliente", async (req, res) => {
  try {
    const {
      nombre, primerApellido, segundoApellido,
      fechaNacimiento, tipoIdentificacion, identificacion,
      paisResidencia, correo, codigoPais, telefono, password
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const pool = await getPool();
    const r = await pool.request()
      .input("nombre", sql.NVarChar(60), nombre)
      .input("primerApellido", sql.NVarChar(60), primerApellido)
      .input("segundoApellido", sql.NVarChar(60), segundoApellido || "")
      .input("fechaNacimiento", sql.Date, fechaNacimiento)
      .input("tipoIdentificacion", sql.NVarChar(20), tipoIdentificacion)
      .input("identificacion", sql.NVarChar(30), identificacion)
      .input("paisResidencia", sql.NVarChar(60), paisResidencia)
      .input("correo", sql.NVarChar(120), correo)
      .input("codigoPais", sql.NVarChar(8), codigoPais)
      .input("numero", sql.NVarChar(20), telefono)
      .input("password", sql.NVarChar(200), passwordHash)
      .execute("dbo.sp_CrearClienteWeb");

    res.json({ ok: true, idCliente: r.recordset[0].idCliente });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

/**
 * REGISTRO ADMIN (anfitrión)
 */
app.post("/api/auth/register/anfitrion", async (req, res) => {
  try {
    const { usuario, password, telefono, ubicacion, tiposEspacio } = req.body;

    if (!usuario || !password) return res.status(400).json({ ok:false, error:"Faltan usuario/contraseña" });
    if (!telefono?.codigoPais || !telefono?.numero) return res.status(400).json({ ok:false, error:"Falta teléfono" });
    if (!ubicacion?.provincia || !ubicacion?.canton || !ubicacion?.distrito || !ubicacion?.direccion)
      return res.status(400).json({ ok:false, error:"Falta ubicación" });
    if (!Array.isArray(tiposEspacio) || !tiposEspacio.length)
      return res.status(400).json({ ok:false, error:"Falta tipos de espacio" });

    const pool = await getPool();
    const r = await pool.request()
      .input("usuario", sql.NVarChar(120), usuario)
      .input("password", sql.NVarChar(200), password)
      .input("codigoPais", sql.NVarChar(8), telefono.codigoPais)
      .input("numero", sql.NVarChar(20), telefono.numero)
      .input("provincia", sql.NVarChar(60), ubicacion.provincia)
      .input("canton", sql.NVarChar(60), ubicacion.canton)
      .input("distrito", sql.NVarChar(60), ubicacion.distrito)
      .input("direccion", sql.NVarChar(250), ubicacion.direccion)
      .input("googleMaps", sql.NVarChar(250), ubicacion.googleMaps || "")
      .input("tiposEspacioJson", sql.NVarChar(sql.MAX), JSON.stringify(tiposEspacio))
      .execute("dbo.sp_CrearAnfitrionWeb");

    res.json({ ok: true, idAdmin: r.recordset?.[0]?.idAdmin });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get("/api/alojamientos", async (req, res) => {
  try {
    const destino = (req.query.destino || "").trim();

    const pool = await getPool();
    const request = pool.request();

    let where = "";
    if (destino) {
      where = `
        WHERE d.provincia LIKE @dest
           OR d.canton   LIKE @dest
           OR d.distrito LIKE @dest
           OR h.nombre   LIKE @dest
      `;
      request.input("dest", sql.NVarChar(120), `%${destino}%`);
    }

    const q = `
      SELECT TOP 30
        h.idHotel,
        h.nombre AS hotel,
        CONCAT(d.provincia, ', ', d.canton, ', ', d.distrito) AS ubicacion,
        MIN(th.precio) AS precioMin,
        MAX(f.urlFoto) AS urlFoto,
        MAX(th.tipoCama) AS tipoCama,
        MAX(th.nombre) AS tipoHabitacion
      FROM dbo.Hotel h
      JOIN dbo.DireccionHotel d ON d.idHotel = h.idHotel
      JOIN dbo.TipoHabitacion th ON th.idHotel = h.idHotel
      LEFT JOIN dbo.FotoTipoHabitacion f ON f.idTipoHabitacion = th.idTipoHabitacion
      ${where}
      GROUP BY h.idHotel, h.nombre, d.provincia, d.canton, d.distrito
      ORDER BY h.idHotel DESC;
    `;

    const r = await request.query(q);
    res.json({ ok: true, items: r.recordset });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});



app.listen(process.env.PORT || 3001, () => {
  console.log("API en http://localhost:" + (process.env.PORT || 3001));
});
