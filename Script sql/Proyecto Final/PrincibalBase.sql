USE PROYE1;
GO
IF OBJECT_ID('dbo.ActividadTipoActividad', 'U') IS NOT NULL DROP TABLE dbo.ActividadTipoActividad;
IF OBJECT_ID('dbo.TipoActividad', 'U') IS NOT NULL DROP TABLE dbo.TipoActividad;
IF OBJECT_ID('dbo.ActividadRecreacion', 'U') IS NOT NULL DROP TABLE dbo.ActividadRecreacion;
IF OBJECT_ID('dbo.EmpresaRecreacion', 'U') IS NOT NULL DROP TABLE dbo.EmpresaRecreacion;

IF OBJECT_ID('dbo.Factura', 'U') IS NOT NULL DROP TABLE dbo.Factura;
IF OBJECT_ID('dbo.Reservacion', 'U') IS NOT NULL DROP TABLE dbo.Reservacion;

IF OBJECT_ID('dbo.TelefonoCliente', 'U') IS NOT NULL DROP TABLE dbo.TelefonoCliente;
IF OBJECT_ID('dbo.DireccionClienteCR', 'U') IS NOT NULL DROP TABLE dbo.DireccionClienteCR;
IF OBJECT_ID('dbo.Cliente', 'U') IS NOT NULL DROP TABLE dbo.Cliente;

IF OBJECT_ID('dbo.Habitacion', 'U') IS NOT NULL DROP TABLE dbo.Habitacion;
IF OBJECT_ID('dbo.FotoTipoHabitacion', 'U') IS NOT NULL DROP TABLE dbo.FotoTipoHabitacion;
IF OBJECT_ID('dbo.TipoHabitacionComodidad', 'U') IS NOT NULL DROP TABLE dbo.TipoHabitacionComodidad;
IF OBJECT_ID('dbo.Comodidad', 'U') IS NOT NULL DROP TABLE dbo.Comodidad;
IF OBJECT_ID('dbo.TipoHabitacion', 'U') IS NOT NULL DROP TABLE dbo.TipoHabitacion;

IF OBJECT_ID('dbo.HotelServicio', 'U') IS NOT NULL DROP TABLE dbo.HotelServicio;
IF OBJECT_ID('dbo.ServicioHotel', 'U') IS NOT NULL DROP TABLE dbo.ServicioHotel;
IF OBJECT_ID('dbo.HotelRedSocial', 'U') IS NOT NULL DROP TABLE dbo.HotelRedSocial;
IF OBJECT_ID('dbo.RedSocial', 'U') IS NOT NULL DROP TABLE dbo.RedSocial;
IF OBJECT_ID('dbo.TelefonoHotel', 'U') IS NOT NULL DROP TABLE dbo.TelefonoHotel;
IF OBJECT_ID('dbo.DireccionHotel', 'U') IS NOT NULL DROP TABLE dbo.DireccionHotel;
IF OBJECT_ID('dbo.Hotel', 'U') IS NOT NULL DROP TABLE dbo.Hotel;
GO

CREATE TABLE dbo.Hotel (
    idHotel            INT IDENTITY(1,1) PRIMARY KEY,
    nombre             NVARCHAR(120) NOT NULL,
    cedulaJuridica     NVARCHAR(30)  NOT NULL,
    tipo               NVARCHAR(30)  NOT NULL,
    correo             NVARCHAR(120) NOT NULL,
    urlSitioWeb        NVARCHAR(200) NULL
);

ALTER TABLE dbo.Hotel
ADD CONSTRAINT UQ_Hotel_Cedula UNIQUE (cedulaJuridica);

ALTER TABLE dbo.Hotel
ADD CONSTRAINT CK_Hotel_Tipo CHECK (tipo IN
('Hotel','Hostal','Casa','Departamento','Cuarto compartido','Cabaña'));
GO

CREATE TABLE dbo.DireccionHotel (
    idDireccionHotel   INT IDENTITY(1,1) PRIMARY KEY,
    idHotel            INT NOT NULL UNIQUE,  -- 1 a 1 
    provincia          NVARCHAR(60) NOT NULL,
    canton             NVARCHAR(60) NOT NULL,
    distrito           NVARCHAR(60) NOT NULL,
    barrio             NVARCHAR(60) NULL,
    senasExactas       NVARCHAR(300) NOT NULL,
    referenciaGPS      NVARCHAR(120) NULL,

    CONSTRAINT FK_DirHotel_Hotel
        FOREIGN KEY (idHotel) REFERENCES dbo.Hotel(idHotel)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.TelefonoHotel (
    idTelefonoHotel    INT IDENTITY(1,1) PRIMARY KEY,
    idHotel            INT NOT NULL,
    tipoTelefono       NVARCHAR(20) NULL,  -- Principal/Secundario (opcional)
    codigoPais         NVARCHAR(8)  NOT NULL, -- ej: +506
    numero             NVARCHAR(20) NOT NULL,

    CONSTRAINT FK_TelHotel_Hotel
        FOREIGN KEY (idHotel) REFERENCES dbo.Hotel(idHotel)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.RedSocial (
    idRedSocial        INT IDENTITY(1,1) PRIMARY KEY,
    nombreRed          NVARCHAR(30) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.HotelRedSocial (
    idHotel            INT NOT NULL,
    idRedSocial        INT NOT NULL,
    urlPerfil          NVARCHAR(250) NOT NULL,

    CONSTRAINT PK_HotelRedSocial PRIMARY KEY (idHotel, idRedSocial),
    CONSTRAINT FK_HotelRedSocial_Hotel FOREIGN KEY (idHotel)
        REFERENCES dbo.Hotel(idHotel) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_HotelRedSocial_Red FOREIGN KEY (idRedSocial)
        REFERENCES dbo.RedSocial(idRedSocial) ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.ServicioHotel (
    idServicioHotel    INT IDENTITY(1,1) PRIMARY KEY,
    nombreServicio     NVARCHAR(60) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.HotelServicio (
    idHotel            INT NOT NULL,
    idServicioHotel    INT NOT NULL,

    CONSTRAINT PK_HotelServicio PRIMARY KEY (idHotel, idServicioHotel),
    CONSTRAINT FK_HotelServicio_Hotel FOREIGN KEY (idHotel)
        REFERENCES dbo.Hotel(idHotel) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_HotelServicio_Serv FOREIGN KEY (idServicioHotel)
        REFERENCES dbo.ServicioHotel(idServicioHotel) ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.TipoHabitacion (
    idTipoHabitacion   INT IDENTITY(1,1) PRIMARY KEY,
    idHotel            INT NOT NULL,
    nombre             NVARCHAR(80)  NOT NULL,
    descripcion        NVARCHAR(300) NULL,
    tipoCama           NVARCHAR(20)  NOT NULL,
    precio             DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_TipoHab_Hotel
        FOREIGN KEY (idHotel)
        REFERENCES dbo.Hotel(idHotel)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

ALTER TABLE dbo.TipoHabitacion
ADD CONSTRAINT CK_TipoHab_TipoCama CHECK (tipoCama IN ('Individual','Queen','King'));

ALTER TABLE dbo.TipoHabitacion
ADD CONSTRAINT CK_TipoHab_Precio CHECK (precio >= 0);
GO

CREATE TABLE dbo.Comodidad (
    idComodidad        INT IDENTITY(1,1) PRIMARY KEY,
    nombreComodidad    NVARCHAR(60) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.TipoHabitacionComodidad (
    idTipoHabitacion   INT NOT NULL,
    idComodidad        INT NOT NULL,

    CONSTRAINT PK_TipoHabCom PRIMARY KEY (idTipoHabitacion, idComodidad),
    CONSTRAINT FK_TipoHabCom_TipoHab FOREIGN KEY (idTipoHabitacion)
        REFERENCES dbo.TipoHabitacion(idTipoHabitacion) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_TipoHabCom_Comod FOREIGN KEY (idComodidad)
        REFERENCES dbo.Comodidad(idComodidad) ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.FotoTipoHabitacion (
    idFoto             INT IDENTITY(1,1) PRIMARY KEY,
    idTipoHabitacion   INT NOT NULL,
    urlFoto            NVARCHAR(250) NOT NULL,

    CONSTRAINT FK_FotoTH_TipoHab FOREIGN KEY (idTipoHabitacion)
        REFERENCES dbo.TipoHabitacion(idTipoHabitacion) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.Habitacion (
    idHabitacion       INT IDENTITY(1,1) PRIMARY KEY,
    idHotel            INT NOT NULL,
    idTipoHabitacion   INT NOT NULL,
    numero             NVARCHAR(15) NOT NULL,
    estado             NVARCHAR(10) NOT NULL
        CONSTRAINT DF_Habitacion_Estado DEFAULT ('Activo'),

    CONSTRAINT FK_Hab_Hotel FOREIGN KEY (idHotel)
        REFERENCES dbo.Hotel(idHotel)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,

    CONSTRAINT FK_Hab_TipoHab FOREIGN KEY (idTipoHabitacion)
        REFERENCES dbo.TipoHabitacion(idTipoHabitacion)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

ALTER TABLE dbo.Habitacion
ADD CONSTRAINT CK_Hab_Estado CHECK (estado IN ('Activo','Inactivo'));

ALTER TABLE dbo.Habitacion
ADD CONSTRAINT UQ_Hab_HotelNumero UNIQUE (idHotel, numero);
GO


CREATE TABLE dbo.Cliente (
    idCliente          INT IDENTITY(1,1) PRIMARY KEY,
    nombre             NVARCHAR(60) NOT NULL,
    primerApellido     NVARCHAR(60) NOT NULL,
    segundoApellido    NVARCHAR(60) NOT NULL,
    fechaNacimiento    DATE NOT NULL,
    tipoIdentificacion NVARCHAR(20) NOT NULL,
    identificacion     NVARCHAR(30) NOT NULL,
    paisResidencia     NVARCHAR(60) NOT NULL,
    correo             NVARCHAR(120) NOT NULL
);

ALTER TABLE dbo.Cliente
ADD CONSTRAINT UQ_Cliente_Identificacion UNIQUE (identificacion);

ALTER TABLE dbo.Cliente
ADD CONSTRAINT CK_Cliente_TipoId CHECK (tipoIdentificacion IN ('Pasaporte','Dimex','Cédula nacional','Otro'));
GO

CREATE TABLE dbo.DireccionClienteCR (
    idDireccionClienteCR INT IDENTITY(1,1) PRIMARY KEY,
    idCliente            INT NOT NULL UNIQUE, -- 0..1 
    provincia            NVARCHAR(60) NOT NULL,
    canton               NVARCHAR(60) NOT NULL,
    distrito             NVARCHAR(60) NOT NULL,

    CONSTRAINT FK_DirCliente_Cliente FOREIGN KEY (idCliente)
        REFERENCES dbo.Cliente(idCliente) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.TelefonoCliente (
    idTelefonoCliente  INT IDENTITY(1,1) PRIMARY KEY,
    idCliente          INT NOT NULL,
    codigoPais         NVARCHAR(8)  NOT NULL,
    numero             NVARCHAR(20) NOT NULL,

    CONSTRAINT FK_TelCliente_Cliente FOREIGN KEY (idCliente)
        REFERENCES dbo.Cliente(idCliente) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.Reservacion (
    idReservacion      INT IDENTITY(1,1) PRIMARY KEY,
    idCliente          INT NOT NULL,
    idHabitacion       INT NOT NULL,
    fechaHoraIngreso   DATETIME2(0) NOT NULL,
    fechaSalida        DATE NOT NULL,
    cantidadPersonas   INT NOT NULL,
    poseeVehiculo      BIT NOT NULL
        CONSTRAINT DF_Reservacion_PoseeVehiculo DEFAULT (0),

    CONSTRAINT FK_Res_Cliente FOREIGN KEY (idCliente)
        REFERENCES dbo.Cliente(idCliente)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT FK_Res_Habitacion FOREIGN KEY (idHabitacion)
        REFERENCES dbo.Habitacion(idHabitacion)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

ALTER TABLE dbo.Reservacion
ADD CONSTRAINT CK_Res_CantPersonas CHECK (cantidadPersonas > 0);

-- CHECK de fechas (profe)
ALTER TABLE dbo.Reservacion
ADD CONSTRAINT CK_Res_Fechas
CHECK (fechaSalida > CAST(fechaHoraIngreso AS date));
GO


CREATE TABLE dbo.Factura (
    idFactura          INT IDENTITY(1,1) PRIMARY KEY,
    idReservacion      INT NOT NULL,
    fechaHoraRegistro  DATETIME2(0) NOT NULL,
    noches             INT NOT NULL,
    cargoHabitacion    DECIMAL(10,2) NOT NULL,
    importeTotal       DECIMAL(10,2) NOT NULL,
    metodoPago         NVARCHAR(20) NOT NULL,

    CONSTRAINT FK_Fac_Res FOREIGN KEY (idReservacion)
        REFERENCES dbo.Reservacion(idReservacion) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- 1 a 1: una factura por reservacion
ALTER TABLE dbo.Factura
ADD CONSTRAINT UQ_Factura_Reservacion UNIQUE (idReservacion);

ALTER TABLE dbo.Factura
ADD CONSTRAINT CK_Factura_MetodoPago CHECK (metodoPago IN ('Efectivo','Tarjeta'));

ALTER TABLE dbo.Factura
ADD CONSTRAINT CK_Factura_Montos CHECK (cargoHabitacion >= 0 AND importeTotal >= 0);

ALTER TABLE dbo.Factura
ADD CONSTRAINT CK_Factura_Noches CHECK (noches > 0);
GO

CREATE TABLE dbo.EmpresaRecreacion (
    idEmpresaRecreacion INT IDENTITY(1,1) PRIMARY KEY,
    nombreEmpresa       NVARCHAR(120) NOT NULL,
    cedulaJuridica      NVARCHAR(30)  NOT NULL,
    correo              NVARCHAR(120) NOT NULL,
    telefono            NVARCHAR(20)  NOT NULL,
    nombreContacto      NVARCHAR(120) NOT NULL,
    provincia           NVARCHAR(60)  NOT NULL,
    canton              NVARCHAR(60)  NOT NULL,
    distrito            NVARCHAR(60)  NOT NULL,
    senasExactas        NVARCHAR(300) NOT NULL
);

ALTER TABLE dbo.EmpresaRecreacion
ADD CONSTRAINT UQ_EmpRec_Cedula UNIQUE (cedulaJuridica);
GO

CREATE TABLE dbo.ActividadRecreacion (
    idActividad         INT IDENTITY(1,1) PRIMARY KEY,
    idEmpresaRecreacion INT NOT NULL,
    tiposServicios      NVARCHAR(200) NULL,
    descripcion         NVARCHAR(400) NOT NULL,
    precio              DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_ActRec_Emp FOREIGN KEY (idEmpresaRecreacion)
        REFERENCES dbo.EmpresaRecreacion(idEmpresaRecreacion)
        ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE dbo.ActividadRecreacion
ADD CONSTRAINT CK_ActRec_Precio CHECK (precio >= 0);
GO

CREATE TABLE dbo.TipoActividad (
    idTipoActividad     INT IDENTITY(1,1) PRIMARY KEY,
    nombreTipoActividad NVARCHAR(60) NOT NULL UNIQUE
);

ALTER TABLE dbo.TipoActividad
ADD CONSTRAINT CK_TipoActividad_Nombre CHECK (nombreTipoActividad IN
('Tour en bote','Tour en lancha','Tour en catamarán','Kayak','Transporte'));
GO

CREATE TABLE dbo.ActividadTipoActividad (
    idActividad      INT NOT NULL,
    idTipoActividad  INT NOT NULL,

    CONSTRAINT PK_Act_TipoAct PRIMARY KEY (idActividad, idTipoActividad),

    CONSTRAINT FK_ActTipo_Act FOREIGN KEY (idActividad)
        REFERENCES dbo.ActividadRecreacion(idActividad) ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT FK_ActTipo_Tipo FOREIGN KEY (idTipoActividad)
        REFERENCES dbo.TipoActividad(idTipoActividad) ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

INSERT INTO dbo.RedSocial(nombreRed)
VALUES ('Facebook'),('Instagram'),('YouTube'),('TikTok'),('Airbnb'),('Threads'),('X');

INSERT INTO dbo.TipoActividad(nombreTipoActividad)
VALUES ('Tour en bote'),('Tour en lancha'),('Tour en catamarán'),('Kayak'),('Transporte');

-- Servicios del hotel
INSERT INTO dbo.ServicioHotel(nombreServicio)
VALUES ('Piscina'),('Wifi'),('Parqueo'),('Restaurante'),('Bar'),('Ranchos');

-- Comodidades
INSERT INTO dbo.Comodidad(nombreComodidad)
VALUES ('Wifi de habitación'),('A/C'),('Ventilador'),('Agua caliente');
GO