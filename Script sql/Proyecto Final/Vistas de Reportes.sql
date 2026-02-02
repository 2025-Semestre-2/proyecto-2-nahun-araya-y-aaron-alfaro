USE PROYE1;
GO

/* =========================================
   1) Facturación por día (para filtrar por rango)
   ========================================= */
CREATE OR ALTER VIEW dbo.vw_Reporte_FacturacionPorDia
AS
SELECT
    CAST(f.fechaHoraRegistro AS date) AS fecha,
    h.idHotel,
    h.nombre AS nombreHotel,
    COUNT(*) AS cantidadFacturas,
    SUM(f.importeTotal) AS totalFacturado,
    SUM(CASE WHEN f.estadoPago='PAGADA' THEN f.importeTotal ELSE 0 END) AS totalPagado,
    SUM(CASE WHEN f.estadoPago='PENDIENTE' THEN f.importeTotal ELSE 0 END) AS totalPendiente
FROM dbo.Factura f
JOIN dbo.Reservacion r ON r.idReservacion = f.idReservacion
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
GROUP BY CAST(f.fechaHoraRegistro AS date), h.idHotel, h.nombre;
GO


/* =========================================
   2) Facturación por mes
   ========================================= */
CREATE OR ALTER VIEW dbo.vw_Reporte_FacturacionPorMes
AS
SELECT
    YEAR(f.fechaHoraRegistro) AS anio,
    MONTH(f.fechaHoraRegistro) AS mes,
    h.idHotel,
    h.nombre AS nombreHotel,
    COUNT(*) AS cantidadFacturas,
    SUM(f.importeTotal) AS totalFacturado
FROM dbo.Factura f
JOIN dbo.Reservacion r ON r.idReservacion = f.idReservacion
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
GROUP BY YEAR(f.fechaHoraRegistro), MONTH(f.fechaHoraRegistro), h.idHotel, h.nombre;
GO


/* =========================================
   3) Demanda: Reservas por hotel y tipo de habitación
   ========================================= */
CREATE OR ALTER VIEW dbo.vw_Reporte_DemandaPorTipoHabitacion
AS
SELECT
    h.idHotel,
    h.nombre AS nombreHotel,
    th.idTipoHabitacion,
    th.nombre AS tipoHabitacion,
    COUNT(r.idReservacion) AS cantidadReservas,
    SUM(CASE WHEN r.estado='ACTIVA' THEN 1 ELSE 0 END) AS reservasActivas,
    SUM(CASE WHEN r.estado='CERRADA' THEN 1 ELSE 0 END) AS reservasCerradas
FROM dbo.Reservacion r
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
JOIN dbo.TipoHabitacion th ON th.idTipoHabitacion = hab.idTipoHabitacion
GROUP BY h.idHotel, h.nombre, th.idTipoHabitacion, th.nombre;
GO


/* =========================================
   4) Edad de clientes (para reportes por rango)
   ========================================= */
CREATE OR ALTER VIEW dbo.vw_Reporte_EdadClientes
AS
SELECT
    c.idCliente,
    CONCAT(c.nombre,' ',c.primerApellido,' ',c.segundoApellido) AS nombreCliente,
    c.fechaNacimiento,
    DATEDIFF(YEAR, c.fechaNacimiento, CAST(GETDATE() AS date))
      - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, c.fechaNacimiento, CAST(GETDATE() AS date)), c.fechaNacimiento) > CAST(GETDATE() AS date)
             THEN 1 ELSE 0 END AS edadAnios,
    c.paisResidencia,
    c.correo
FROM dbo.Cliente c;
GO


/* =========================================
   5) Top hoteles por ingresos (para ranking)
   ========================================= */
CREATE OR ALTER VIEW dbo.vw_Reporte_TopHotelesIngresos
AS
SELECT
    h.idHotel,
    h.nombre AS nombreHotel,
    SUM(f.importeTotal) AS ingresosTotales,
    SUM(CASE WHEN f.estadoPago='PAGADA' THEN f.importeTotal ELSE 0 END) AS ingresosPagados,
    SUM(CASE WHEN f.estadoPago='PENDIENTE' THEN f.importeTotal ELSE 0 END) AS ingresosPendientes
FROM dbo.Factura f
JOIN dbo.Reservacion r ON r.idReservacion = f.idReservacion
JOIN dbo.Habitacion hab ON hab.idHabitacion = r.idHabitacion
JOIN dbo.Hotel h ON h.idHotel = hab.idHotel
GROUP BY h.idHotel, h.nombre;
GO
