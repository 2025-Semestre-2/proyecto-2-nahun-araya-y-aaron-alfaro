USE PROYE1;
GO

CREATE OR ALTER TRIGGER dbo.TR_NoDelete_Factura
ON dbo.Factura
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR('No se permite eliminar facturas.', 16, 1);
END;
GO

CREATE OR ALTER TRIGGER dbo.TR_NoDelete_Reservacion
ON dbo.Reservacion
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR('No se permite eliminar reservaciones.', 16, 1);
END;
GO

CREATE OR ALTER TRIGGER dbo.TR_NoDelete_ClienteConReservas
ON dbo.Cliente
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN dbo.Reservacion r ON r.idCliente = d.idCliente
    )
    BEGIN
        RAISERROR('No se permite eliminar clientes con reservaciones.', 16, 1);
        RETURN;
    END

    -- Si no tiene reservas, sí permitimos eliminar
    DELETE c
    FROM dbo.Cliente c
    JOIN deleted d ON d.idCliente = c.idCliente;
END;
GO
