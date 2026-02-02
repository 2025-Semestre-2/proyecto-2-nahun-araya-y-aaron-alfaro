ALTER PROCEDURE dbo.sp_CrearClienteWeb
  @nombre NVARCHAR(60),
  @primerApellido NVARCHAR(60),
  @segundoApellido NVARCHAR(60),
  @fechaNacimiento DATE,
  @tipoIdentificacion NVARCHAR(20),
  @identificacion NVARCHAR(30),
  @paisResidencia NVARCHAR(60),
  @correo NVARCHAR(120),
  @codigoPais NVARCHAR(8),
  @numero NVARCHAR(20),
  @password NVARCHAR(200)
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  BEGIN TRY
    BEGIN TRAN;

    IF EXISTS (
        SELECT 1
        FROM dbo.TelefonoCliente
        WHERE codigoPais = @codigoPais
          AND numero = @numero
    )
    BEGIN
        THROW 50001, 'Teléfono ya existe.', 1;
    END

    INSERT INTO dbo.Cliente (
        nombre, primerApellido, segundoApellido, fechaNacimiento,
        tipoIdentificacion, identificacion, paisResidencia, correo
    )
    VALUES (
        @nombre, @primerApellido, @segundoApellido, @fechaNacimiento,
        @tipoIdentificacion, @identificacion, @paisResidencia, @correo
    );

    DECLARE @idCliente INT = SCOPE_IDENTITY();

    INSERT INTO dbo.TelefonoCliente (idCliente, codigoPais, numero)
    VALUES (@idCliente, @codigoPais, @numero);

    -- ✅ NUEVO: guardar password (hash) en tabla aparte
    INSERT INTO dbo.CredencialesCliente (idCliente, passwordHash)
    VALUES (@idCliente, @password);

    COMMIT;

    SELECT @idCliente AS idCliente;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    THROW;
  END CATCH
END
GO


ALTER TABLE dbo.TelefonoCliente
ADD CONSTRAINT UQ_TelefonoCliente_CodigoPais_Telefono
UNIQUE (codigoPais, numero);
GO