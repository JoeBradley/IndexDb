using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndexDb.Models
{
    public class Data
    {
        public List<Contact> Contacts { get; set; } = new List<Contact>();
        public List<EmailAddress> Emails { get; set; } = new List<EmailAddress>();
        public List<PhoneNumber> PhoneNumbers { get; set; } = new List<PhoneNumber>();
    }

    public class Contact
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Profile { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime Modified { get; set; }
    }

    public class EmailAddress
    {
        public int Id { get; set; }
        public int? ContactId { get; set; }
        public string Type { get; set; }
        public string Email { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime Modified { get; set; }
    }

    public class PhoneNumber
    {
        public int Id { get; set; }
        public int? ContactId { get; set; }
        public string Type { get; set; }
        public string Phone { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime Modified { get; set; }
    }
}