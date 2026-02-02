CREATE TABLE dbo.UbicacionAnfitrion (
  idUbicacionAnfitrion INT IDENTITY(1,1) PRIMARY KEY,
  idAdmin INT NOT NULL UNIQUE,
  provincia NVARCHAR(60) NOT NULL,
  canton NVARCHAR(60) NOT NULL,
  distrito NVARCHAR(60) NOT NULL,
  direccion NVARCHAR(250) NOT NULL,
  googleMaps NVARCHAR(250) NULL,
  CONSTRAINT FK_UbicacionAnfitrion_Admin FOREIGN KEY (idAdmin) REFERENCES dbo.AdminCuenta(idAdmin)
);
GO

CREATE TABLE dbo.TipoEspacioAnfitrion (
  idTipoEspacioAnfitrion INT IDENTITY(1,1) PRIMARY KEY,
  idAdmin INT NOT NULL,
  tipoEspacio NVARCHAR(60) NOT NULL,
  CONSTRAINT FK_TipoEspacio_Admin FOREIGN KEY (idAdmin) REFERENCES dbo.AdminCuenta(idAdmin),
  CONSTRAINT UQ_TipoEspacio UNIQUE (idAdmin, tipoEspacio)
);
GO

CREATE TABLE dbo.TelefonoAdmin (
  idTelefonoAdmin INT IDENTITY(1,1) PRIMARY KEY,
  idAdmin INT NOT NULL,
  codigoPais NVARCHAR(8) NOT NULL,
  numero NVARCHAR(20) NOT NULL,
  CONSTRAINT FK_TelAdmin_Admin FOREIGN KEY (idAdmin) REFERENCES dbo.AdminCuenta(idAdmin),
  CONSTRAINT UQ_TelAdmin UNIQUE (codigoPais, numero)
);
GO

CREATE OR ALTER PROCEDURE dbo.sp_CrearAnfitrionWeb
  @usuario NVARCHAR(120),
  @password NVARCHAR(200),
  @codigoPais NVARCHAR(8),
  @numero NVARCHAR(20),
  @provincia NVARCHAR(60),
  @canton NVARCHAR(60),
  @distrito NVARCHAR(60),
  @direccion NVARCHAR(250),
  @googleMaps NVARCHAR(250),
  @tiposEspacioJson NVARCHAR(MAX)
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  BEGIN TRY
    BEGIN TRAN;

    IF EXISTS (SELECT 1 FROM dbo.AdminCuenta WHERE usuario = @usuario)
      THROW 54001, 'Usuario ya existe.', 1;

    IF EXISTS (SELECT 1 FROM dbo.TelefonoAdmin WHERE codigoPais=@codigoPais AND numero=@numero)
      THROW 54002, 'Teléfono ya existe.', 1;

    DECLARE @salt UNIQUEIDENTIFIER = NEWID();
    DECLARE @hash VARBINARY(32) =
      HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36), @salt) + @password);

    INSERT INTO dbo.AdminCuenta (usuario, salt, passwordHash)
    VALUES (@usuario, @salt, @hash);

    DECLARE @idAdmin INT = SCOPE_IDENTITY();

    INSERT INTO dbo.TelefonoAdmin (idAdmin, codigoPais, numero)
    VALUES (@idAdmin, @codigoPais, @numero);

    INSERT INTO dbo.UbicacionAnfitrion (idAdmin, provincia, canton, distrito, direccion, googleMaps)
    VALUES (@idAdmin, @provincia, @canton, @distrito, @direccion, NULLIF(@googleMaps,''));

    INSERT INTO dbo.TipoEspacioAnfitrion (idAdmin, tipoEspacio)
    SELECT @idAdmin, value
    FROM OPENJSON(@tiposEspacioJson);

    COMMIT;

    SELECT @idAdmin AS idAdmin;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    THROW;
  END CATCH
END
GO
