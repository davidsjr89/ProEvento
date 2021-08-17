namespace Application.Dtos
{
    public class RedeSocialDto
    {
        public int Id { get; set; } 
        public string Nome { get; set; }
        public string URL { get; set; }
        public int? EventoId { get; set; }
        public EventoDto EventoDto { get; set; }
        public int? PalestranteId { get; set; }
        public PalestranteDto PalestranteDto { get; set; }
    }
}