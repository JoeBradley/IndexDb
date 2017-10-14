using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndexDb.Models
{
    public class Data
    {
        public List<Contact> Contacts { get; set; }
        public List<EmailAddress> Emails { get; set; }
        public List<PhoneNumber> PhoneNumbers { get; set; }
    }

    public class Contact
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
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