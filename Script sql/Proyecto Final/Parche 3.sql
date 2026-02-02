USE PROYE1;
GO

IF COL_LENGTH('dbo.Reservacion','estado') IS NULL
BEGIN
    ALTER TABLE dbo.Reservacion
    ADD estado NVARCHAR(10) NOT NULL
        CONSTRAINT DF_Reservacion_Estado DEFAULT ('ACTIVA');
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name='CK_Reservacion_Estado'
      AND parent_object_id=OBJECT_ID('dbo.Reservacion')
)
BEGIN
    ALTER TABLE dbo.Reservacion
    ADD CONSTRAINT CK_Reservacion_Estado
    CHECK (estado IN ('ACTIVA','CERRADA'));
END
GO
