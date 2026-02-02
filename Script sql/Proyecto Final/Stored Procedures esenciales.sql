USE PROYE1;
GO

/* =========================
   1) Crear Cliente
   ========================= */
CREATE OR ALTER PROCEDURE dbo.sp_CrearCliente
    @nombre NVARCHAR(60),
    @primerApellido NVARCHAR(60),
    @segundoApellido NVARCHAR(60),
    @fechaNacimiento DATE,
    @tipoIdentificacion NVARCHAR(20),
    @identificacion NVARCHAR(30),
    @paisResidencia NVARCHAR(60),
    @correo NVARCHAR(120)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Cliente
    (nombre, primerApellido, segundoApellido, fechaNacimiento, tipoIdentificacion, identificacion, paisResidencia, correo)
    VALUES
    (@nombre, @primerApellido, @segundoApellido, @fechaNacimiento, @tipoIdentificacion, @identificacion, @paisResidencia, @correo);

    SELECT SCOPE_IDENTITY() AS idCliente;
END;
GO


/* =========================
   2) Crear Reservación (ACTIVA)
   ========================= */
CREATE OR ALTER PROCEDURE dbo.sp_CrearReservacion
    @idCliente INT,
    @idHabitacion INT,
    @fechaHoraIngreso DATETIME2(0),
    @fechaSalida DATE,
    @cantidadPersonas INT,
    @poseeVehiculo BIT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Reservacion
    (idCliente, idHabitacion, fechaHoraIngreso, fechaSalida, cantidadPersonas, poseeVehiculo, estado)
    VALUES
    (@idCliente, @idHabitacion, @fechaHoraIngreso, @fechaSalida, @cantidadPersonas, @poseeVehiculo, 'ACTIVA');

    SELECT SCOPE_IDENTITY() AS idReservacion;
END;
GO


/* =========================
   3) Cerrar Reservación (esto dispara el TRIGGER y crea Factura)
   ========================= */
CREATE OR ALTER PROCEDURE dbo.sp_CerrarReservacion
    @idReservacion INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Reservacion
    SET estado = 'CERRADA'
    WHERE idReservacion = @idReservacion
      AND estado = 'ACTIVA';

    -- Devuelve la factura (si ya existe, la muestra)
    SELECT f.*
    FROM dbo.Factura f
    WHERE f.idReservacion = @idReservacion;
END;
GO


/* =========================
   4) Pagar Factura (cambia estadoPago + metodoPago)
   ========================= */
CREATE OR ALTER PROCEDURE dbo.sp_PagarFactura
    @idFactura INT,
    @metodoPago NVARCHAR(20)  -- 'Efectivo' o 'Tarjeta'
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Factura
    SET estadoPago = 'PAGADA',
        metodoPago = @metodoPago
    WHERE idFactura = @idFactura
      AND estadoPago = 'PENDIENTE';

    SELECT * FROM dbo.Factura WHERE idFactura = @idFactura;
END;
GO
