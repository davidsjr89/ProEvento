using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence.Contexto;
using Persistence.Interface;

namespace Persistence
{
    public class PalestrantePersist : IPalestrantePersist
    {
        private readonly ProEventosContext _context;

        public PalestrantePersist(ProEventosContext context)
        {
            _context = context;
        }
        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
             IQueryable<Palestrante> query  = _context.Palestrantes.Include(x => x.RedesSociais);

            if(includeEventos)
            {
                query = query.Include(e => e.PalestrantesEventos).ThenInclude(x => x.Evento);
            }                
            query = query.AsNoTracking().OrderBy(e => e.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query  = _context.Palestrantes.Include(x => x.RedesSociais);

            if(includeEventos)
            {
                query = query.Include(e => e.PalestrantesEventos).ThenInclude(x => x.Evento);
            }                
            query = query.AsNoTracking().OrderBy(e => e.Id).Where(e => e.Nome.ToLower().Contains(nome.ToLower()));
            return await query.ToArrayAsync();
        }


        public async Task<Palestrante> GetPalestranteByNomeAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query  = _context.Palestrantes.Include(x => x.RedesSociais);

            if(includeEventos)
            {
                query = query.Include(e => e.PalestrantesEventos).ThenInclude(x => x.Evento);
            }                
            query = query.AsNoTracking().OrderBy(e => e.Id).Where(e => e.Id == palestranteId);
            return await query.FirstOrDefaultAsync();
        }

    }
}