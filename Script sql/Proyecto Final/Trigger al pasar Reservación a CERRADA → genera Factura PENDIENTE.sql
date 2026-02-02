USE PROYE1;
GO

CREATE OR ALTER TRIGGER dbo.TR_Reservacion_Cierre_GeneraFactura
ON dbo.Reservacion
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH Cierres AS (
        SELECT i.idReservacion, i.idHabitacion, i.fechaHoraIngreso, i.fechaSalida
        FROM inserted i
        JOIN deleted d ON d.idReservacion = i.idReservacion
        WHERE d.estado = 'ACTIVA'
          AND i.estado = 'CERRADA'
    )
    INSERT INTO dbo.Factura (idReservacion, fechaHoraRegistro, noches, cargoHabitacion, importeTotal, metodoPago, estadoPago)
    SELECT
        c.idReservacion,
        SYSDATETIME(),
        DATEDIFF(DAY, CAST(c.fechaHoraIngreso AS date), c.fechaSalida) AS noches,
        th.precio AS cargoHabitacion,
        th.precio * DATEDIFF(DAY, CAST(c.fechaHoraIngreso AS date), c.fechaSalida) AS importeTotal,
        NULL AS metodoPago,
        'PENDIENTE' AS estadoPago
    FROM Cierres c
    JOIN dbo.Habitacion h ON h.idHabitacion = c.idHabitacion
    JOIN dbo.TipoHabitacion th ON th.idTipoHabitacion = h.idTipoHabitacion
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Factura f WHERE f.idReservacion = c.idReservacion
    );
END;
GO
