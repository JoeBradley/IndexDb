using IndexDb.App_Start;
using IndexDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace IndexDb.Controllers
{
    public class SyncController : ApiController
    {
        // GET: api/Sync
        public Data Get()
        {
            return DataStore.Load();
        }

        // POST: api/Sync
        public void Post([FromBody]Data value)
        {
            DataStore.Save(value);
        }
    }
}
