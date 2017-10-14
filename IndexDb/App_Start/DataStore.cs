using IndexDb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;

namespace IndexDb.App_Start
{
    public class DataStore
    {
        public static void Init()
        {
            var data = Load();            
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
            data.Contacts.Add(new Contact { Id = 1, FirstName = "Chris", LastName = "Cassidy", Modified = DateTime.Now, Timestamp = DateTime.Now });
            data.Contacts.Add(new Contact { Id = 2, FirstName = "Anna", LastName = "Cassidy", Modified = DateTime.Now, Timestamp = DateTime.Now });

            data.Emails.Add(new EmailAddress { Id = 1, ContactId = 1, Email = "chri@cassidy.com", Modified = DateTime.Now, Timestamp = DateTime.Now });
            data.Emails.Add(new EmailAddress { Id = 2, ContactId = 2, Email = "anna@cassidy.com", Modified = DateTime.Now, Timestamp = DateTime.Now });

            data.PhoneNumbers.Add(new PhoneNumber { Id = 1, ContactId = 1, Phone = "9876543210", Modified = DateTime.Now, Timestamp = DateTime.Now });
            data.PhoneNumbers.Add(new PhoneNumber { Id = 2, ContactId = 2, Phone = "1234567890", Modified = DateTime.Now, Timestamp = DateTime.Now });
        }
    }
}