using System.Threading.Tasks;
using Application.Contratos;
using Application.Dtos;
using AutoMapper;
using Domain;
using Persistence.Interface;

namespace Application
{
    public class EventoService : IEventosService
    {
        private readonly IEventoPersist _eventoPersist;
        private readonly IGeralPersist _geralPersist;
        private readonly IMapper _mapper;
        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
            _mapper = mapper;
        }
        public async Task<EventoDto> AddEventos(EventoDto modelDto)
        {
            try
            {
                var evento = _mapper.Map<Evento>(modelDto);

                _geralPersist.Add<Evento>(evento);
                if(await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }
                return null;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());
            }
        }
        public async Task<EventoDto> UpdateEventos(int eventoId, EventoDto modelDto)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) return null;
                modelDto.Id = evento.Id;

                var model = _mapper.Map<Evento>(modelDto);

                _geralPersist.Update(model);
                if(await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(modelDto.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
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

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if(evento == null) return null;

                var resultados = _mapper.Map<EventoDto[]>(evento);

                return resultados;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if(evento == null) return null;

                var resultados = _mapper.Map<EventoDto[]>(evento);

                return resultados;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if(evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);

                return resultado;
            }
             catch (System.Exception e)
            {
                throw new System.Exception(e.Message.ToString());;
            }
        }

    }
}