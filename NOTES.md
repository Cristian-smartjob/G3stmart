Listo - En detalle de preinvoicedetail en los asignados o no asignados cuando pincho en el checkbox se borran los datos de smarter y cargo
Listo - Boton recalcular no hace nada
Listo - Cargaras smarters en base a que empresa estan actualmente
Listo - Validar en la creacion de preinvoice si el cliente no tiene ningun smarter relacionado, no se puede crear,
Listo - debe aparecer una alerta dentro del modal igual que la validacion de datos.
Listo - Añadir pestaña de completados
Listo - Si esta descargada, no puede modificar nada estaria bloqueada

Mejorar diseno de bloqueo ya que se ve muy feo actualmente
% de margen de diferencia factura y monto oc
Total por cobrar uf, esto implicaria una modificacion en la bbdd para agregar las uf actualizadas y siempre tomar el mes anio para el ultimo dia habil de uf

Preguntas de negocio
Cuando se crea la prefactura, te calcula el total a facturar pero despues cual es la funcion y la logica que hay detras del boton recalcular
Tareas post preguntas de negocio

- actualizar boton prefactura

prompt pendiente
perfecto, ahora necesito actualizar el archivo @setup_pg_database_updated.sql ya que necesito actualizar los insert de people y de preinvoicedetail ya que estos datos deben tener las siguientes carcteristicas:

1. People debe tener datos asociados a todos los clients registrados, al menos 2 o 3 por cada cliente
2. en preinvoicedetail hay un dato muy importante que debes considerar para el mockdata, y es que si se esta haciendo un preinvoicedetail todos los person id que entren en este detalle deben estar bajo el mismo clientid del preinvoice por lo tanto tambien deberas crear mas preinvoice
