USE PROYE1;
GO

/* =========================================================
   1) Hoteles: buscador + detalle
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_Hoteles_Buscador
AS
SELECT
    h.idHotel,
    h.nombre,
    h.tipo,
    h.correo,
    h.urlSitioWeb,
    dh.provincia,
    dh.canton,
    dh.distrito,
    dh.barrio,
    dh.senasExactas,
    dh.referenciaGPS
FROM dbo.Hotel h
LEFT JOIN dbo.DireccionHotel dh ON dh.idHotel = h.idHotel;
GO

CREATE OR ALTER VIEW dbo.vw_Hotel_Telefonos
AS
SELECT
    t.idHotel,
    t.tipoTelefono,
    t.codigoPais,
    t.numero
FROM dbo.TelefonoHotel t;
GO

CREATE OR ALTER VIEW dbo.vw_Hotel_RedesSociales
AS
SELECT
    hr.idHotel,
    r.nombreRed,
    hr.urlPerfil
FROM dbo.HotelRedSocial hr
JOIN dbo.RedSocial r ON r.idRedSocial = hr.idRedSocial;
GO

CREATE OR ALTER VIEW dbo.vw_Hotel_Servicios
AS
SELECT
    hs.idHotel,
    s.nombreServicio
FROM dbo.HotelServicio hs
JOIN dbo.ServicioHotel s ON s.idServicioHotel = hs.idServicioHotel;
GO


/* =========================================================
   2) Habitaciones y tipos: detalle + comodidades + fotos
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_TiposHabitacion_Detalle
AS
SELECT
    th.idTipoHabitacion,
    th.idHotel,
    th.nombre AS nombreTipoHabitacion,
    th.descripcion,
    th.tipoCama,
    th.precio
FROM dbo.TipoHabitacion th;
GO

CREATE OR ALTER VIEW dbo.vw_TipoHabitacion_Comodidades
AS
SELECT
    thc.idTipoHabitacion,
    c.nombreComodidad
FROM dbo.TipoHabitacionComodidad thc
JOIN dbo.Comodidad c ON c.idComodidad = thc.idComodidad;
GO

CREATE OR ALTER VIEW dbo.vw_TipoHabitacion_Fotos
AS
SELECT
    f.idTipoHabitacion,
    f.urlFoto
FROM dbo.FotoTipoHabitacion f;
GO

CREATE OR ALTER VIEW dbo.vw_Habitaciones_Detalle
AS
SELECT
    hab.idHabitacion,
    hab.idHotel,
    h.nombre AS nombreHotel,
    hab.idTipoHabitacion,
    th.nombre AS nombreTipoHabitacion,
    th.tipoCama,
    th.precio,
    hab.numero,
    hab.estado AS estadoHabitacion
FROM dbo.Habitacion hab
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
JOIN dbo.TipoHabitacion th ON th.idTipoHabitacion = hab.idTipoHabitacion;
GO


/* =========================================================
   3) Clientes: perfil + teléfonos + dirección CR
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_Clientes_Perfil
AS
SELECT
    c.idCliente,
    c.nombre,
    c.primerApellido,
    c.segundoApellido,
    c.fechaNacimiento,
    c.tipoIdentificacion,
    c.identificacion,
    c.paisResidencia,
    c.correo
FROM dbo.Cliente c;
GO

CREATE OR ALTER VIEW dbo.vw_Cliente_Telefonos
AS
SELECT
    t.idCliente,
    t.codigoPais,
    t.numero
FROM dbo.TelefonoCliente t;
GO

CREATE OR ALTER VIEW dbo.vw_Cliente_DireccionCR
AS
SELECT
    d.idCliente,
    d.provincia,
    d.canton,
    d.distrito
FROM dbo.DireccionClienteCR d;
GO


/* =========================================================
   4) Reservaciones: detalle (para historial y administración)
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_Reservaciones_Detalle
AS
SELECT
    r.idReservacion,
    r.estado,
    r.fechaHoraIngreso,
    r.fechaSalida,
    r.cantidadPersonas,
    r.poseeVehiculo,

    c.idCliente,
    CONCAT(c.nombre,' ',c.primerApellido,' ',c.segundoApellido) AS nombreCliente,
    c.correo AS correoCliente,

    hab.idHabitacion,
    hab.numero AS numeroHabitacion,

    h.idHotel,
    h.nombre AS nombreHotel,

    th.idTipoHabitacion,
    th.nombre AS tipoHabitacion,
    th.precio
FROM dbo.Reservacion r
JOIN dbo.Cliente c ON c.idCliente = r.idCliente
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
JOIN dbo.TipoHabitacion th ON th.idTipoHabitacion = hab.idTipoHabitacion;
GO


/* =========================================================
   5) Facturación: detalle + resumen
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_Facturas_Detalle
AS
SELECT
    f.idFactura,
    f.idReservacion,
    f.fechaHoraRegistro,
    f.noches,
    f.cargoHabitacion,
    f.importeTotal,
    f.metodoPago,
    f.estadoPago,

    r.estado AS estadoReservacion,
    r.fechaHoraIngreso,
    r.fechaSalida,

    c.idCliente,
    CONCAT(c.nombre,' ',c.primerApellido,' ',c.segundoApellido) AS nombreCliente,
    c.correo AS correoCliente,

    h.idHotel,
    h.nombre AS nombreHotel,
    hab.numero AS numeroHabitacion
FROM dbo.Factura f
JOIN dbo.Reservacion r ON r.idReservacion = f.idReservacion
JOIN dbo.Cliente c ON c.idCliente = r.idCliente
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel;
GO

CREATE OR ALTER VIEW dbo.vw_Facturacion_ResumenPorHotel
AS
SELECT
    h.idHotel,
    h.nombre AS nombreHotel,
    COUNT(f.idFactura) AS cantidadFacturas,
    SUM(f.importeTotal) AS totalFacturado,
    SUM(CASE WHEN f.estadoPago='PAGADA' THEN f.importeTotal ELSE 0 END) AS totalPagado,
    SUM(CASE WHEN f.estadoPago='PENDIENTE' THEN f.importeTotal ELSE 0 END) AS totalPendiente
FROM dbo.Factura f
JOIN dbo.Reservacion r ON r.idReservacion = f.idReservacion
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
GROUP BY h.idHotel, h.nombre;
GO


/* =========================================================
   6) Recreación: empresas + actividades + tipos
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_EmpresasRecreacion
AS
SELECT
    e.idEmpresaRecreacion,
    e.nombreEmpresa,
    e.cedulaJuridica,
    e.correo,
    e.telefono,
    e.nombreContacto,
    e.provincia,
    e.canton,
    e.distrito,
    e.senasExactas
FROM dbo.EmpresaRecreacion e;
GO

CREATE OR ALTER VIEW dbo.vw_ActividadesRecreacion_Detalle
AS
SELECT
    a.idActividad,
    a.idEmpresaRecreacion,
    e.nombreEmpresa,
    a.tiposServicios,
    a.descripcion,
    a.precio
FROM dbo.ActividadRecreacion a
JOIN dbo.EmpresaRecreacion e ON e.idEmpresaRecreacion = a.idEmpresaRecreacion;
GO

CREATE OR ALTER VIEW dbo.vw_Actividad_Tipos
AS
SELECT
    ata.idActividad,
    ta.nombreTipoActividad
FROM dbo.ActividadTipoActividad ata
JOIN dbo.TipoActividad ta ON ta.idTipoActividad = ata.idTipoActividad;
GO


/* =========================================================
   7) Vista base para disponibilidad (la web filtra por fechas)
   ========================================================= */
CREATE OR ALTER VIEW dbo.vw_Disponibilidad_Base
AS
SELECT
    d.idHabitacion,
    d.idHotel,
    d.nombreHotel,
    d.idTipoHabitacion,
    d.nombreTipoHabitacion,
    d.tipoCama,
    d.precio,
    d.numero,
    d.estadoHabitacion
FROM dbo.vw_Habitaciones_Detalle d
WHERE d.estadoHabitacion = 'Activo';
GO
