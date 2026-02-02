USE PROYE1;
GO

/* =========================
   1) UNIQUE en correos
========================= */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_Hotel_Correo' AND object_id=OBJECT_ID('dbo.Hotel'))
    ALTER TABLE dbo.Hotel ADD CONSTRAINT UQ_Hotel_Correo UNIQUE (correo);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_Cliente_Correo' AND object_id=OBJECT_ID('dbo.Cliente'))
    ALTER TABLE dbo.Cliente ADD CONSTRAINT UQ_Cliente_Correo UNIQUE (correo);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_EmpRec_Correo' AND object_id=OBJECT_ID('dbo.EmpresaRecreacion'))
    ALTER TABLE dbo.EmpresaRecreacion ADD CONSTRAINT UQ_EmpRec_Correo UNIQUE (correo);
GO

/* (Opcional recomendado) evitar teléfonos repetidos */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_TelefonoCliente' AND object_id=OBJECT_ID('dbo.TelefonoCliente'))
    ALTER TABLE dbo.TelefonoCliente ADD CONSTRAINT UQ_TelefonoCliente UNIQUE (codigoPais, numero);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_TelefonoHotel' AND object_id=OBJECT_ID('dbo.TelefonoHotel'))
    ALTER TABLE dbo.TelefonoHotel ADD CONSTRAINT UQ_TelefonoHotel UNIQUE (codigoPais, numero);
GO


/* =========================
   2) Tablas de autenticación
   (para login web real)
========================= */
IF OBJECT_ID('dbo.ClienteCuenta','U') IS NULL
BEGIN
    CREATE TABLE dbo.ClienteCuenta(
        idCliente INT NOT NULL PRIMARY KEY,
        salt UNIQUEIDENTIFIER NOT NULL,
        passwordHash VARBINARY(32) NOT NULL,
        creadoEn DATETIME2(0) NOT NULL CONSTRAINT DF_ClienteCuenta_creadoEn DEFAULT (SYSDATETIME()),
        CONSTRAINT FK_ClienteCuenta_Cliente FOREIGN KEY (idCliente)
            REFERENCES dbo.Cliente(idCliente) ON DELETE CASCADE
    );
END
GO

IF OBJECT_ID('dbo.AdminCuenta','U') IS NULL
BEGIN
    CREATE TABLE dbo.AdminCuenta(
        idAdmin INT IDENTITY(1,1) PRIMARY KEY,
        usuario NVARCHAR(120) NOT NULL UNIQUE,  -- email o username
        salt UNIQUEIDENTIFIER NOT NULL,
        passwordHash VARBINARY(32) NOT NULL,
        creadoEn DATETIME2(0) NOT NULL CONSTRAINT DF_AdminCuenta_creadoEn DEFAULT (SYSDATETIME())
    );
END
GO


/* =========================
   3) Stored Procedures
========================= */

-- Crear cliente + teléfono + cuenta
CREATE OR ALTER PROCEDURE dbo.sp_CrearClienteWeb
    @nombre NVARCHAR(60),
    @primerApellido NVARCHAR(60),
    @segundoApellido NVARCHAR(60) = N'',
    @fechaNacimiento DATE,
    @tipoIdentificacion NVARCHAR(20),
    @identificacion NVARCHAR(30),
    @paisResidencia NVARCHAR(60),
    @correo NVARCHAR(120),
    @codigoPais NVARCHAR(8),
    @telefono NVARCHAR(20),
    @password NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.Cliente WHERE identificacion = @identificacion)
        THROW 50001, 'Identificación ya existe.', 1;

    IF EXISTS (SELECT 1 FROM dbo.Cliente WHERE correo = @correo)
        THROW 50002, 'Correo ya existe.', 1;

    INSERT INTO dbo.Cliente(nombre, primerApellido, segundoApellido, fechaNacimiento,
                            tipoIdentificacion, identificacion, paisResidencia, correo)
    VALUES (@nombre, @primerApellido, @segundoApellido, @fechaNacimiento,
            @tipoIdentificacion, @identificacion, @paisResidencia, @correo);

    DECLARE @idCliente INT = SCOPE_IDENTITY();

    -- teléfono
    IF EXISTS (SELECT 1 FROM dbo.TelefonoCliente WHERE codigoPais=@codigoPais AND numero=@telefono)
        THROW 50003, 'Teléfono ya existe.', 1;

    INSERT INTO dbo.TelefonoCliente(idCliente, codigoPais, numero)
    VALUES (@idCliente, @codigoPais, @telefono);

    -- cuenta
    DECLARE @salt UNIQUEIDENTIFIER = NEWID();
    DECLARE @hash VARBINARY(32) = HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36),@salt) + @password);

    INSERT INTO dbo.ClienteCuenta(idCliente, salt, passwordHash)
    VALUES (@idCliente, @salt, @hash);

    SELECT @idCliente AS idCliente;
END
GO

-- Login cliente por correo o por "+50663084229"
CREATE OR ALTER PROCEDURE dbo.sp_LoginClienteWeb
    @login NVARCHAR(120),
    @password NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idCliente INT = NULL;

    IF CHARINDEX('@', @login) > 0
    BEGIN
        SELECT @idCliente = idCliente
        FROM dbo.Cliente
        WHERE correo = @login;
    END
    ELSE
    BEGIN
        -- login por teléfono: "+50663084229" (sin espacios)
        SELECT TOP 1 @idCliente = tc.idCliente
        FROM dbo.TelefonoCliente tc
        WHERE (tc.codigoPais + tc.numero) = @login;
    END

    IF @idCliente IS NULL
        SELECT 0 AS ok;
    ELSE
    BEGIN
        DECLARE @salt UNIQUEIDENTIFIER, @hash VARBINARY(32);

        SELECT @salt = salt, @hash = passwordHash
        FROM dbo.ClienteCuenta
        WHERE idCliente = @idCliente;

        IF @hash = HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36),@salt) + @password)
            SELECT 1 AS ok, @idCliente AS idCliente;
        ELSE
            SELECT 0 AS ok;
    END
END
GO

-- Crear admin (anfitrión) para poder loguearse
CREATE OR ALTER PROCEDURE dbo.sp_CrearAdminWeb
    @usuario NVARCHAR(120),
    @password NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.AdminCuenta WHERE usuario=@usuario)
        THROW 50010, 'Usuario admin ya existe.', 1;

    DECLARE @salt UNIQUEIDENTIFIER = NEWID();
    DECLARE @hash VARBINARY(32) = HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36),@salt) + @password);

    INSERT INTO dbo.AdminCuenta(usuario, salt, passwordHash)
    VALUES (@usuario, @salt, @hash);

    SELECT SCOPE_IDENTITY() AS idAdmin;
END
GO

-- Login admin
CREATE OR ALTER PROCEDURE dbo.sp_LoginAdminWeb
    @usuario NVARCHAR(120),
    @password NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @salt UNIQUEIDENTIFIER, @hash VARBINARY(32), @idAdmin INT;

    SELECT @idAdmin = idAdmin, @salt = salt, @hash = passwordHash
    FROM dbo.AdminCuenta
    WHERE usuario=@usuario;

    IF @idAdmin IS NULL
        SELECT 0 AS ok;
    ELSE IF @hash = HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36),@salt) + @password)
        SELECT 1 AS ok, @idAdmin AS idAdmin;
    ELSE
        SELECT 0 AS ok;
END
GO


/* =========================
   4) Permisos (UsuarioHotel)
========================= */
-- OJO: si tu login se llama distinto, cambia UsuarioHotel
GRANT EXECUTE ON dbo.sp_CrearClienteWeb TO UsuarioHotel;
GRANT EXECUTE ON dbo.sp_LoginClienteWeb TO UsuarioHotel;
GRANT EXECUTE ON dbo.sp_CrearAdminWeb   TO UsuarioHotel;
GRANT EXECUTE ON dbo.sp_LoginAdminWeb   TO UsuarioHotel;
GO
