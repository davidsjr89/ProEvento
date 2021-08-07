using System.Threading.Tasks;
using Domain;

namespace Persistence.Interface
{
    public interface IPalestrantePersist
    {
        Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false);
        Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false);
        Task<Palestrante> GetPalestranteByNomeAsync(int palestranteId, bool includeEventos = false);
    }
}