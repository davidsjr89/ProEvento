using System.Collections.Generic;

namespace Application.Dtos
{
    public class PalestranteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string MiniCurriculo { get; set; }
        public string imagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociaisDto { get; set; }
        public IEnumerable<PalestranteDto> PalestrantesDto { get; set; }
    }
}