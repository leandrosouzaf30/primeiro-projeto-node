import { Router } from "express";
import { uuid } from "uuidv4";
import { startOfHour, parseISO, isEqual } from "date-fns";

const appointmentsRoutes = Router();

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointments: Appointment[] = [];

appointmentsRoutes.get("/", (request, response) => {
  if (!appointments.length) {
    return response.status(400).json("Has not exist appointments!");
  }

  return response.json(appointments);
});

appointmentsRoutes.post("/", (request, response) => {
  const { provider, date } = request.body;

  const parseDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointments.find((appointment) =>
    isEqual(appointment.date, parseDate)
  );

  if (findAppointmentInSameDate) {
    return response.status(400).json("This appointment is already booked");
  }

  const appointment = {
    id: uuid(),
    provider,
    date: parseDate,
  };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRoutes;
