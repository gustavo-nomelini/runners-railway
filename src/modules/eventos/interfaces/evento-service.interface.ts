import { CreateEventoDto } from '../dtos/create-evento.dto';
import { FindEventosDto } from '../dtos/find-eventos.dto';
import { UpdateEventoDto } from '../dtos/update-evento.dto';
import {
  EventoDetailResponse,
  EventoPaginationResponse,
} from './evento.interface';

export interface IEventoService {
  /**
   * Create a new event
   * @param userId - ID of the user creating the event
   * @param createEventoDto - Event data for creation
   */
  create(
    userId: number,
    createEventoDto: CreateEventoDto,
  ): Promise<EventoDetailResponse>;

  /**
   * Find all events with pagination and filters
   * @param query - Query parameters for filtering events
   */
  findAll(query: FindEventosDto): Promise<EventoPaginationResponse>;

  /**
   * Find a single event by ID
   * @param id - Event ID
   */
  findOne(id: number): Promise<EventoDetailResponse>;

  /**
   * Update an existing event
   * @param id - Event ID
   * @param userId - ID of the user updating the event
   * @param userPermissionLevel - Permission level of the user
   * @param updateEventoDto - Event data for update
   */
  update(
    id: number,
    userId: number,
    userPermissionLevel: number,
    updateEventoDto: UpdateEventoDto,
  ): Promise<EventoDetailResponse>;

  /**
   * Delete an event
   * @param id - Event ID
   * @param userId - ID of the user deleting the event
   * @param userPermissionLevel - Permission level of the user
   */
  remove(
    id: number,
    userId: number,
    userPermissionLevel: number,
  ): Promise<{ success: boolean; message: string }>;
}
