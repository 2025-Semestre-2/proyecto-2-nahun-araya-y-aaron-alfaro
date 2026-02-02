USE PROYE1;
GO

/* =========================================================
   A) Uniques pedidos + recomendados
   ========================================================= */

-- UNIQUE correo hotel (profe)
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name='UQ_Hotel_Correo' AND parent_object_id=OBJECT_ID('dbo.Hotel'))
    ALTER TABLE dbo.Hotel ADD CONSTRAINT UQ_Hotel_Correo UNIQUE (correo);
GO

-- UNIQUE correo cliente (profe)
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name='UQ_Cliente_Correo' AND parent_object_id=OBJECT_ID('dbo.Cliente'))
    ALTER TABLE dbo.Cliente ADD CONSTRAINT UQ_Cliente_Correo UNIQUE (correo);
GO

-- Evitar teléfonos duplicados por dueño (recomendado web)
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name='UQ_TelHotel_Unico' AND parent_object_id=OBJECT_ID('dbo.TelefonoHotel'))
    ALTER TABLE dbo.TelefonoHotel ADD CONSTRAINT UQ_TelHotel_Unico UNIQUE (idHotel, codigoPais, numero);
GO

IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name='UQ_TelCliente_Unico' AND parent_object_id=OBJECT_ID('dbo.TelefonoCliente'))
    ALTER TABLE dbo.TelefonoCliente ADD CONSTRAINT UQ_TelCliente_Unico UNIQUE (idCliente, codigoPais, numero);
GO


/* =========================================================
   B) Checks “necesarios” para app web
   ========================================================= */

-- Cliente: fechaNacimiento no futura
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Cliente_FechaNacimiento' AND parent_object_id=OBJECT_ID('dbo.Cliente'))
    ALTER TABLE dbo.Cliente
    ADD CONSTRAINT CK_Cliente_FechaNacimiento
    CHECK (fechaNacimiento <= CAST(GETDATE() AS date));
GO

-- Factura: total >= cargoHabitacion
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Factura_TotalMayorIgualCargo' AND parent_object_id=OBJECT_ID('dbo.Factura'))
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT CK_Factura_TotalMayorIgualCargo
    CHECK (importeTotal >= cargoHabitacion);
GO

-- TelefonoHotel tipoTelefono si viene, que sea válido
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_TelHotel_TipoTelefono' AND parent_object_id=OBJECT_ID('dbo.TelefonoHotel'))
    ALTER TABLE dbo.TelefonoHotel
    ADD CONSTRAINT CK_TelHotel_TipoTelefono
    CHECK (tipoTelefono IS NULL OR tipoTelefono IN ('Principal','Secundario'));
GO


/* =========================================================
   C) Quitar ON UPDATE CASCADE (best practice)
   No se actualizan IDs identity; evita problemas de cascadas.
   ========================================================= */

-- FACTURA: FK_Fac_Res tiene ON UPDATE CASCADE en tu script, lo cambiamos a NO ACTION
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_Fac_Res')
BEGIN
    ALTER TABLE dbo.Factura DROP CONSTRAINT FK_Fac_Res;
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT FK_Fac_Res
    FOREIGN KEY (idReservacion)
    REFERENCES dbo.Reservacion(idReservacion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
END
GO

-- DireccionHotel
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_DirHotel_Hotel')
BEGIN
    ALTER TABLE dbo.DireccionHotel DROP CONSTRAINT FK_DirHotel_Hotel;
    ALTER TABLE dbo.DireccionHotel
    ADD CONSTRAINT FK_DirHotel_Hotel
    FOREIGN KEY (idHotel)
    REFERENCES dbo.Hotel(idHotel)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

-- TelefonoHotel
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_TelHotel_Hotel')
BEGIN
    ALTER TABLE dbo.TelefonoHotel DROP CONSTRAINT FK_TelHotel_Hotel;
    ALTER TABLE dbo.TelefonoHotel
    ADD CONSTRAINT FK_TelHotel_Hotel
    FOREIGN KEY (idHotel)
    REFERENCES dbo.Hotel(idHotel)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

-- HotelRedSocial (ambos FKs)
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_HotelRedSocial_Hotel')
BEGIN
    ALTER TABLE dbo.HotelRedSocial DROP CONSTRAINT FK_HotelRedSocial_Hotel;
    ALTER TABLE dbo.HotelRedSocial
    ADD CONSTRAINT FK_HotelRedSocial_Hotel
    FOREIGN KEY (idHotel)
    REFERENCES dbo.Hotel(idHotel)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_HotelRedSocial_Red')
BEGIN
    ALTER TABLE dbo.HotelRedSocial DROP CONSTRAINT FK_HotelRedSocial_Red;
    ALTER TABLE dbo.HotelRedSocial
    ADD CONSTRAINT FK_HotelRedSocial_Red
    FOREIGN KEY (idRedSocial)
    REFERENCES dbo.RedSocial(idRedSocial)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
END
GO

-- HotelServicio (ambos FKs)
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_HotelServicio_Hotel')
BEGIN
    ALTER TABLE dbo.HotelServicio DROP CONSTRAINT FK_HotelServicio_Hotel;
    ALTER TABLE dbo.HotelServicio
    ADD CONSTRAINT FK_HotelServicio_Hotel
    FOREIGN KEY (idHotel)
    REFERENCES dbo.Hotel(idHotel)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_HotelServicio_Serv')
BEGIN
    ALTER TABLE dbo.HotelServicio DROP CONSTRAINT FK_HotelServicio_Serv;
    ALTER TABLE dbo.HotelServicio
    ADD CONSTRAINT FK_HotelServicio_Serv
    FOREIGN KEY (idServicioHotel)
    REFERENCES dbo.ServicioHotel(idServicioHotel)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
END
GO

-- TipoHabitacionComodidad
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_TipoHabCom_TipoHab')
BEGIN
    ALTER TABLE dbo.TipoHabitacionComodidad DROP CONSTRAINT FK_TipoHabCom_TipoHab;
    ALTER TABLE dbo.TipoHabitacionComodidad
    ADD CONSTRAINT FK_TipoHabCom_TipoHab
    FOREIGN KEY (idTipoHabitacion)
    REFERENCES dbo.TipoHabitacion(idTipoHabitacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_TipoHabCom_Comod')
BEGIN
    ALTER TABLE dbo.TipoHabitacionComodidad DROP CONSTRAINT FK_TipoHabCom_Comod;
    ALTER TABLE dbo.TipoHabitacionComodidad
    ADD CONSTRAINT FK_TipoHabCom_Comod
    FOREIGN KEY (idComodidad)
    REFERENCES dbo.Comodidad(idComodidad)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
END
GO

-- FotoTipoHabitacion
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_FotoTH_TipoHab')
BEGIN
    ALTER TABLE dbo.FotoTipoHabitacion DROP CONSTRAINT FK_FotoTH_TipoHab;
    ALTER TABLE dbo.FotoTipoHabitacion
    ADD CONSTRAINT FK_FotoTH_TipoHab
    FOREIGN KEY (idTipoHabitacion)
    REFERENCES dbo.TipoHabitacion(idTipoHabitacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

-- DireccionClienteCR
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_DirCliente_Cliente')
BEGIN
    ALTER TABLE dbo.DireccionClienteCR DROP CONSTRAINT FK_DirCliente_Cliente;
    ALTER TABLE dbo.DireccionClienteCR
    ADD CONSTRAINT FK_DirCliente_Cliente
    FOREIGN KEY (idCliente)
    REFERENCES dbo.Cliente(idCliente)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

-- TelefonoCliente
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_TelCliente_Cliente')
BEGIN
    ALTER TABLE dbo.TelefonoCliente DROP CONSTRAINT FK_TelCliente_Cliente;
    ALTER TABLE dbo.TelefonoCliente
    ADD CONSTRAINT FK_TelCliente_Cliente
    FOREIGN KEY (idCliente)
    REFERENCES dbo.Cliente(idCliente)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

-- ActividadRecreacion
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_ActRec_Emp')
BEGIN
    ALTER TABLE dbo.ActividadRecreacion DROP CONSTRAINT FK_ActRec_Emp;
    ALTER TABLE dbo.ActividadRecreacion
    ADD CONSTRAINT FK_ActRec_Emp
    FOREIGN KEY (idEmpresaRecreacion)
    REFERENCES dbo.EmpresaRecreacion(idEmpresaRecreacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

-- ActividadTipoActividad
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_ActTipo_Act')
BEGIN
    ALTER TABLE dbo.ActividadTipoActividad DROP CONSTRAINT FK_ActTipo_Act;
    ALTER TABLE dbo.ActividadTipoActividad
    ADD CONSTRAINT FK_ActTipo_Act
    FOREIGN KEY (idActividad)
    REFERENCES dbo.ActividadRecreacion(idActividad)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
END
GO

IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_ActTipo_Tipo')
BEGIN
    ALTER TABLE dbo.ActividadTipoActividad DROP CONSTRAINT FK_ActTipo_Tipo;
    ALTER TABLE dbo.ActividadTipoActividad
    ADD CONSTRAINT FK_ActTipo_Tipo
    FOREIGN KEY (idTipoActividad)
    REFERENCES dbo.TipoActividad(idTipoActividad)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
END
GO


/* =========================================================
   Índices (solo si NO existen)
   ========================================================= */

IF OBJECT_ID('dbo.TipoHabitacion','U') IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_TipoHabitacion_idHotel' AND object_id=OBJECT_ID('dbo.TipoHabitacion'))
    CREATE INDEX IX_TipoHabitacion_idHotel ON dbo.TipoHabitacion(idHotel);
GO

IF OBJECT_ID('dbo.Habitacion','U') IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Habitacion_idHotel' AND object_id=OBJECT_ID('dbo.Habitacion'))
    CREATE INDEX IX_Habitacion_idHotel ON dbo.Habitacion(idHotel);
GO

IF OBJECT_ID('dbo.Habitacion','U') IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Habitacion_idTipoHabitacion' AND object_id=OBJECT_ID('dbo.Habitacion'))
    CREATE INDEX IX_Habitacion_idTipoHabitacion ON dbo.Habitacion(idTipoHabitacion);
GO

IF OBJECT_ID('dbo.Reservacion','U') IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Reservacion_idCliente' AND object_id=OBJECT_ID('dbo.Reservacion'))
    CREATE INDEX IX_Reservacion_idCliente ON dbo.Reservacion(idCliente);
GO

IF OBJECT_ID('dbo.Reservacion','U') IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Reservacion_idHabitacion' AND object_id=OBJECT_ID('dbo.Reservacion'))
    CREATE INDEX IX_Reservacion_idHabitacion ON dbo.Reservacion(idHabitacion);
GO

IF OBJECT_ID('dbo.Factura','U') IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Factura_idReservacion' AND object_id=OBJECT_ID('dbo.Factura'))
    CREATE INDEX IX_Factura_idReservacion ON dbo.Factura(idReservacion);
GO

