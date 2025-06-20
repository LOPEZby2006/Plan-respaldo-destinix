import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { getItinerario, addEvento, getSitiosPorTipo, deleteEvento, editEvento } from "../services/api";
import Swal from "sweetalert2";
import styles from "../styles/iti.module.css";

const Itinerario = () => {
    const [events, setEvents] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [sitios, setSitios] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        horaInicio: "",
        horaFin: "",
        tipoEvento: "",
        sitioSeleccionado: "",
    });

    useEffect(() => {
        fetchItinerario();
    }, []);

    const handleEventClick = async (eventInfo) => {
        const { id } = eventInfo.event.extendedProps;
    
        Swal.fire({
            title: '¿Qué deseas hacer?',
            showCancelButton: true,
            confirmButtonText: 'Editar',
            cancelButtonText: 'Eliminar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Lógica para editar el evento
                const evento = events.find(e => e.id_itinerario === id);
                setFormData({
                    nombre: evento.descripcion,
                    horaInicio: evento.hora_inicio,
                    horaFin: evento.hora_fin,
                    tipoEvento: evento.tipo_actividad, // Este campo debe ser llenado
                    sitioSeleccionado: evento.id_sitio || evento.id_hoteles || evento.id_restaurante,
                    id_itinerario: evento.id_itinerario, // Asegúrate de incluir el ID del evento
                });
                setSelectedDates([evento.fecha_itinerario]);
    
                // Cargar los sitios correspondientes al tipo de evento
                const sitiosFiltrados = await getSitiosPorTipo(evento.tipo_actividad);
                setSitios(sitiosFiltrados);
            } else if (result.isDismissed) {
                // Lógica para eliminar el evento
                const response = await deleteEvento(id);
                if (response.success) {
                    fetchItinerario(); // Refresca el itinerario
                    Swal.fire('Eliminado', 'El evento ha sido eliminado', 'success');
                } else {
                    Swal.fire('Error', response.error, 'error');
                }
            }
        });
    };

    const fetchItinerario = async () => {
        try {
            const response = await getItinerario();
            setEvents(response);
        } catch (error) {
            console.error("Error al obtener el itinerario:", error);
        }
    };

    const handleDateSelect = (selectInfo) => {
        const selected = selectInfo.startStr;
        setSelectedDates((prev) => [...new Set([...prev, selected])]);
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "tipoEvento" && value) {
            const sitiosFiltrados = await getSitiosPorTipo(value);
            setSitios(sitiosFiltrados);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (selectedDates.length === 0) {
            Swal.fire("Error", "Selecciona al menos una fecha", "error");
            return;
        }
    
        // Crear un objeto con los datos del evento
        const eventoData = {
            ...formData,
            fecha: selectedDates[0], // Asumiendo que solo se edita o agrega un evento a la vez
        };
    
        let response;
    
        // Verificar si estamos editando un evento o agregando uno nuevo
        if (formData.id_itinerario) {
            // Si hay un ID, estamos editando
            response = await editEvento({ ...eventoData, id_itinerario: formData.id_itinerario });
        } else {
            // Si no hay ID, estamos agregando un nuevo evento
            response = await addEvento(eventoData);
        }
    
        if (response.success) {
            Swal.fire("Éxito", formData.id_itinerario ? "Evento actualizado correctamente" : "Evento agregado correctamente", "success");
            fetchItinerario(); // Refresca el itinerario
        } else {
            Swal.fire("Error", response.error, "error");
        }
    
        // Restablecer el formulario
        setSelectedDates([]);
        setFormData({
            nombre: "",
            horaInicio: "",
            horaFin: "",
            tipoEvento: "",
            sitioSeleccionado: "",
            id_itinerario: "", // Asegúrate de restablecer el ID también
        });
        setSitios([]);
    };

    return (
        <div className={styles.contenedor}>
  <h1 className={styles.title}>Itinerario</h1>

  <div className={styles.row}>
    <div className={styles.calendarioWrapper}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events.map(event => ({
          ...event,
          title: event.nombre_actividad,
          date: event.fecha_itinerario,
          extendedProps: {
            id: event.id_itinerario,
            tipo: event.tipo_actividad,
          },
        }))}
        eventColor="#FF5733"
        eventTextColor="#fff"
        eventContent={(eventInfo) => (
          <div className={styles.eventcontent}>
            <i className={styles.facalendarday}></i>
            <span>{eventInfo.event.title}</span>
          </div>
        )}
        height="auto"
        eventClick={handleEventClick}
      />
    </div>

    {selectedDates.length > 0 && (
      <div className={styles.selectdate}>
        <h2 className={styles.textselecdate}>Agregar Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={styles.textlabel}>Descripción:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className={styles.inputdate}
            />
          </div>

          <div className="flex gap-4">
            <div>
              <label className={styles.textlabel}>Hora de Inicio:</label>
              <input
                type="time"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleInputChange}
                required
                className={styles.inputdate}
              />
            </div>

            <div>
              <label className={styles.textlabel}>Hora de Fin:</label>
              <input
                type="time"
                name="horaFin"
                value={formData.horaFin}
                onChange={handleInputChange}
                required
                className={styles.inputdate}
              />
            </div>
          </div>

          <div>
            <label className={styles.textlabel}>Tipo de Evento:</label>
            <select
              name="tipoEvento"
              value={formData.tipoEvento}
              onChange={handleInputChange}
              required
              className={styles.inputdate}
            >
              <option value="">Selecciona un tipo</option>
              <option value="hotel">Hotel</option>
              <option value="restaurante">Restaurante</option>
              <option value="sitio_turistico">Sitio Turístico</option>
            </select>
          </div>

          {formData.tipoEvento && (
            <div>
              <label className={styles.textlabel}>Selecciona un sitio:</label>
              <select
                name="sitioSeleccionado"
                value={formData.sitioSeleccionado}
                onChange={handleInputChange}
                required
                className={styles.inputdate}
              >
                <option value="">Selecciona una opción</option>
                {sitios.length > 0 ? (
                  sitios.map((sitio) => (
                    <option key={sitio.id} value={sitio.id}>
                      {sitio.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay sitios disponibles</option>
                )}
              </select>
            </div>
          )}

          <button type="submit" className={styles.button}>
            Guardar Evento
          </button>
        </form>
      </div>
    )}
  </div>
</div>

    );
};

export default Itinerario;
