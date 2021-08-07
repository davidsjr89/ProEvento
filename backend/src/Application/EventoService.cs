using System.Threading.Tasks;
using Application.Contratos;
using Domain;
using Persistence.Interface;

namespace Application
{
    public class EventoService : IEventosService
    {
        private readonly IEventoPersist _eventoPersist;
        private readonly IGeralPersist _geralPersist;
        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;

        }
        public async Task<Evento> AddEventos(Evento model)
        {
            try
            {
                _geralPersist.Add(model);
                if(await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());
            }
        }
        public async Task<Evento> UpdateEventos(int eventoId, Evento model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) return null;
                model.Id = evento.Id;
                _geralPersist.Update(model);
                if(await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }
        public async Task<bool> DeleteEventos(int eventoId)
        {
             try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) throw new System.Exception("Evento para delete não foi encontrado");
                _geralPersist.Delete(evento);

                return await _geralPersist.SaveChangesAsync();
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if(evento == null) return null;

                return evento;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if(evento == null) return null;

                return evento;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if(evento == null) return null;

                return evento;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

    }
}