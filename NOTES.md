Cargaras smarters en base a que empresa estan actualmente
En detalle de preinvoice en los asignados cuando pincho en el checkbox se borran los datos de smarter y cargo

Si esta descargada, no puede modificar nada estaria bloqueada

% de margen de diferencia factura y monto oc

Añadir pestaña de completados

prompt pendiente
perfecto, ahora necesito actualizar el archivo @setup_pg_database_updated.sql ya que necesito actualizar los insert de people y de preinvoicedetail ya que estos datos deben tener las siguientes carcteristicas:

1. People debe tener datos asociados a todos los clients registrados, al menos 2 o 3 por cada cliente
2. en preinvoicedetail hay un dato muy importante que debes considerar para el mockdata, y es que si se esta haciendo un preinvoicedetail todos los person id que entren en este detalle deben estar bajo el mismo clientid del preinvoice por lo tanto tambien deberas crear mas preinvoice
