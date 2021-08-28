using Microsoft.AspNetCore.Mvc;
using Application.Contratos;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Application.Dtos;
using Application;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LotesController : ControllerBase
    {
        private readonly ILoteService _loteService;
        public LotesController(ILoteService loteService)
        {
            _loteService = loteService;
        }

        [HttpGet("{eventoId}")]
        public async Task<IActionResult> Get(int eventoId)
        {
            try
            {
                var lotes = await _loteService.GetLotesByEventoIdAsync(eventoId);
                if (lotes == null) return NotFound("Nenhum evento encontrado");
                
                return Ok(lotes);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar lotes. Erro: {ex.Message}");
            }
        }
            
        [HttpPut("{eventoId}")]
        public async Task<IActionResult> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _loteService.SaveLote(eventoId, models);
                if (lotes == null) return NotFound();

                return Ok(lotes);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar lotes. Erro: {ex.Message}");
            }
        }
        
        [HttpDelete("{eventoId}/{loteId}")]
        public async Task<IActionResult> Delete(int eventoId, int loteId)
        {
            try
            {
                var lote = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null ) return NoContent();
 

               return await _loteService.DeleteLote(eventoId, lote.Id) 
               ? Ok(new { message = "Lote Deletado"})
               : throw new System.Exception("Ocorreu um problema especifico ");
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar lotes. Erro: {ex.Message}");
            }
        }

    }
}