using System;
using System.Collections.Generic;
using System.Linq;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventoController : ControllerBase
    {
        private IEnumerable<Evento> _evento = new Evento[]
            {
                new Evento()
                {
                    EventoId = 1, 
                    Tema = "Angular 11 e .NET 5",
                    Local = "Poá",
                    Lote = "1º Lote",
                    QtdPessoas = 250,
                    DataEvento = DateTime.Now.AddDays(2).ToString()
                },
                new Evento()
                {
                    EventoId = 2, 
                    Tema = "Angular 11 e .NET 5",
                    Local = "Remoto",
                    Lote = "2º Lote",
                    QtdPessoas = 450,
                    DataEvento = DateTime.Now.AddDays(3).ToString()
                },
            };
        public EventoController()
        {
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }
        [HttpGet("{id}")]
        public IEnumerable<Evento> Get(int id)
        {
            return _evento.Where(e => e.EventoId == id);
        }
    }
}
