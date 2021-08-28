using System.Linq;
using System.Threading.Tasks;
using Application.Contratos;
using Application.Dtos;
using AutoMapper;
using Domain;
using Persistence.Interface;

namespace Application
{
    public class LoteService : ILoteService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly ILotePersist _lotePersist;
        private readonly IMapper _mapper;
        public LoteService(IGeralPersist geralPersist, ILotePersist lotePersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _lotePersist = lotePersist;
            _mapper = mapper;
        }

        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) throw new System.Exception("Lote para delete não encontrado");

                _geralPersist.Delete<Lote>(lote);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) return null;

                return _mapper.Map<LoteDto>(lote);
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lote = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lote == null) return null;

                return _mapper.Map<LoteDto[]>(lote);
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> SaveLote(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return null;

                foreach (var model in models)
                {
                    if(model.Id == 0)
                    {
                        await AddLote(eventoId, model);
                    }
                    else
                    {
                        // var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);
                        // model.EventoId = eventoId;
                        // _mapper.Map(model, lote);
                        // _geralPersist.Update<Lote>(lote);

                        // await _geralPersist.SaveChangesAsync();
                        await UpdateLote(lotes, model, eventoId);
                    }
                }

                var loteRetorno = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                return _mapper.Map<LoteDto[]>(loteRetorno);
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        private async Task AddLote(int eventoId, LoteDto model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                lote.EventoId = eventoId;
                _geralPersist.Add<Lote>(lote);
                await _geralPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        private async Task UpdateLote(Lote[] lotes, LoteDto model, int eventoId)
        {
            try
            {
                var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);
                        model.EventoId = eventoId;
                        _mapper.Map(model, lote);
                        _geralPersist.Update<Lote>(lote);

                        await _geralPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
    }
}