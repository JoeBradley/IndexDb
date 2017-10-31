using IndexDb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using Ploeh.AutoFixture;

namespace IndexDb.App_Start
{
    public class DataStore
    {
        public static void Init()
        {
            var data = new Data();            
            Populate(ref data);
            Save(data);
        }

        public static Data Load() {
            var json = File.ReadAllText(HttpContext.Current.Server.MapPath("/App_Data/contacts.json"));
            var data = JsonConvert.DeserializeObject<Data>(json);
            return data;
        }

        public static void Save(Data data)
        {
            var json = JsonConvert.SerializeObject(data);
            File.WriteAllText(HttpContext.Current.Server.MapPath("/App_Data/contacts.json"),json);
        }

        private static void Populate(ref Data data)
        {
            var fixture = new Fixture();
            int items = 30;
            int id = 1;

            Clear(ref data);

            data.Contacts.AddRange(fixture.Build<Contact>()
                .With(x => x.Id, id++)
                .With(x => x.Profile, "/Images/Profiles/Chris.jpg")
                .CreateMany<Contact>(items));

            id = 1;
            data.Emails.AddRange(fixture.Build<EmailAddress>()
                .With(x => x.Id, id++)
                .With(x => x.ContactId, id)
                .CreateMany(items));

            id = 1;
            data.PhoneNumbers.AddRange(fixture.Build<PhoneNumber>()
                .With(x => x.Id, id++)
                .With(x => x.ContactId, id)
                .CreateMany(items));
        }

        private static void Clear(ref Data data) {
            data.Contacts.Clear();
            data.Emails.Clear();
            data.PhoneNumbers.Clear();
        }
    }
}