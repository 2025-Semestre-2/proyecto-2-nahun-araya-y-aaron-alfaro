ALTER PROCEDURE dbo.sp_LoginClienteWeb
  @login NVARCHAR(120)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idCliente INT = NULL;

  -- Normalizar un toque (quitar espacios)
  SET @login = REPLACE(@login, ' ', '');

  IF CHARINDEX('@', @login) > 0
  BEGIN
    SELECT @idCliente = idCliente
    FROM dbo.Cliente
    WHERE correo = @login;
  END
  ELSE
  BEGIN
    SELECT TOP 1 @idCliente = tc.idCliente
    FROM dbo.TelefonoCliente tc
    WHERE (tc.codigoPais + tc.numero) = @login;
  END

  IF @idCliente IS NULL
    RETURN;

  -- devolver hash (string bcrypt) para comparar en Node
  SELECT
    @idCliente AS idCliente,
    cc.passwordHash
  FROM dbo.CredencialesCliente cc
  WHERE cc.idCliente = @idCliente;
END
GO
