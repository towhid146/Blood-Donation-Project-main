/**
 * Bangladesh Hospitals & Clinics Database
 * Organized by Division and District
 * BDMS - Blood Donation Management System
 */

const BD_HOSPITALS = {
  divisions: [
    {
      name: "Dhaka",
      districts: [
        {
          name: "Dhaka",
          hospitals: [
            // Government Hospitals
            {
              name: "Dhaka Medical College Hospital",
              type: "Government",
              address: "Secretariat Road, Dhaka",
            },
            {
              name: "Sir Salimullah Medical College & Mitford Hospital",
              type: "Government",
              address: "Mitford, Dhaka",
            },
            {
              name: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
              type: "Government",
              address: "Shahbag, Dhaka",
            },
            {
              name: "National Institute of Cardiovascular Diseases (NICVD)",
              type: "Government",
              address: "Sher-e-Bangla Nagar, Dhaka",
            },
            {
              name: "National Institute of Neurosciences & Hospital",
              type: "Government",
              address: "Agargaon, Dhaka",
            },
            {
              name: "National Institute of Kidney Diseases & Urology",
              type: "Government",
              address: "Sher-e-Bangla Nagar, Dhaka",
            },
            {
              name: "National Institute of Cancer Research & Hospital",
              type: "Government",
              address: "Mohakhali, Dhaka",
            },
            {
              name: "National Institute of Mental Health (NIMH)",
              type: "Government",
              address: "Sher-e-Bangla Nagar, Dhaka",
            },
            {
              name: "Shaheed Suhrawardy Medical College Hospital",
              type: "Government",
              address: "Sher-e-Bangla Nagar, Dhaka",
            },
            {
              name: "Mugda Medical College Hospital",
              type: "Government",
              address: "Mugda, Dhaka",
            },
            {
              name: "Kuwait Bangladesh Friendship Government Hospital",
              type: "Government",
              address: "Uttara, Dhaka",
            },
            // Private Hospitals
            {
              name: "Square Hospital",
              type: "Private",
              address: "Panthapath, Dhaka",
            },
            {
              name: "United Hospital",
              type: "Private",
              address: "Gulshan 2, Dhaka",
            },
            {
              name: "Apollo Hospitals Dhaka",
              type: "Private",
              address: "Bashundhara, Dhaka",
            },
            {
              name: "Evercare Hospital Dhaka",
              type: "Private",
              address: "Bashundhara, Dhaka",
            },
            {
              name: "Labaid Specialized Hospital",
              type: "Private",
              address: "Dhanmondi, Dhaka",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Dhanmondi, Dhaka",
            },
            {
              name: "Ibn Sina Hospital",
              type: "Private",
              address: "Dhanmondi, Dhaka",
            },
            {
              name: "Central Hospital Limited",
              type: "Private",
              address: "Dhanmondi, Dhaka",
            },
            {
              name: "Green Life Medical College Hospital",
              type: "Private",
              address: "Green Road, Dhaka",
            },
            {
              name: "Anwer Khan Modern Medical College Hospital",
              type: "Private",
              address: "Dhanmondi, Dhaka",
            },
            {
              name: "Bangladesh Specialized Hospital",
              type: "Private",
              address: "Shyamoli, Dhaka",
            },
            {
              name: "Comfort Nursing Home",
              type: "Private",
              address: "Malibagh, Dhaka",
            },
            {
              name: "Holy Family Red Crescent Medical College Hospital",
              type: "Private",
              address: "Eskaton, Dhaka",
            },
            {
              name: "Japan Bangladesh Friendship Hospital",
              type: "Private",
              address: "Mohammadpur, Dhaka",
            },
            {
              name: "Ad-din Medical College Hospital",
              type: "Private",
              address: "Maghbazar, Dhaka",
            },
            {
              name: "Asgar Ali Hospital",
              type: "Private",
              address: "Gandaria, Dhaka",
            },
            {
              name: "BRB Hospital",
              type: "Private",
              address: "Panthapath, Dhaka",
            },
            {
              name: "BIRDEM General Hospital",
              type: "Private",
              address: "Shahbag, Dhaka",
            },
            {
              name: "Medinova Medical Services",
              type: "Private",
              address: "Malibagh, Dhaka",
            },
          ],
        },
        {
          name: "Gazipur",
          hospitals: [
            {
              name: "Shaheed Tajuddin Ahmad Medical College Hospital",
              type: "Government",
              address: "Gazipur",
            },
            {
              name: "Gazipur Sadar Hospital",
              type: "Government",
              address: "Gazipur Sadar",
            },
            {
              name: "Tongi Pilot High School & College Hospital",
              type: "Government",
              address: "Tongi",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Gazipur",
            },
            { name: "Lab One Diagnostic", type: "Private", address: "Gazipur" },
          ],
        },
        {
          name: "Narayanganj",
          hospitals: [
            {
              name: "Narayanganj General Hospital",
              type: "Government",
              address: "Narayanganj Sadar",
            },
            {
              name: "250 Bed District Hospital",
              type: "Government",
              address: "Narayanganj",
            },
            {
              name: "Narayanganj Diabetic Hospital",
              type: "Private",
              address: "Narayanganj",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Narayanganj",
            },
          ],
        },
        {
          name: "Tangail",
          hospitals: [
            {
              name: "Tangail General Hospital",
              type: "Government",
              address: "Tangail Sadar",
            },
            {
              name: "250 Bed District Hospital Tangail",
              type: "Government",
              address: "Tangail",
            },
            {
              name: "Kumudini Women's Medical College Hospital",
              type: "Private",
              address: "Mirzapur, Tangail",
            },
          ],
        },
        {
          name: "Kishoreganj",
          hospitals: [
            {
              name: "Kishoreganj General Hospital",
              type: "Government",
              address: "Kishoreganj Sadar",
            },
            {
              name: "250 Bed District Hospital",
              type: "Government",
              address: "Kishoreganj",
            },
          ],
        },
        {
          name: "Manikganj",
          hospitals: [
            {
              name: "Manikganj Sadar Hospital",
              type: "Government",
              address: "Manikganj Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Manikganj",
            },
          ],
        },
        {
          name: "Munshiganj",
          hospitals: [
            {
              name: "Munshiganj General Hospital",
              type: "Government",
              address: "Munshiganj Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Munshiganj",
            },
          ],
        },
        {
          name: "Narsingdi",
          hospitals: [
            {
              name: "Narsingdi General Hospital",
              type: "Government",
              address: "Narsingdi Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Narsingdi",
            },
          ],
        },
        {
          name: "Faridpur",
          hospitals: [
            {
              name: "Faridpur Medical College Hospital",
              type: "Government",
              address: "Faridpur Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Faridpur",
            },
          ],
        },
        {
          name: "Gopalganj",
          hospitals: [
            {
              name: "Sheikh Fazilatunnesa Mujib Memorial KPJ Specialized Hospital",
              type: "Private",
              address: "Gopalganj",
            },
            {
              name: "Gopalganj General Hospital",
              type: "Government",
              address: "Gopalganj Sadar",
            },
          ],
        },
        {
          name: "Madaripur",
          hospitals: [
            {
              name: "Madaripur General Hospital",
              type: "Government",
              address: "Madaripur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Madaripur",
            },
          ],
        },
        {
          name: "Rajbari",
          hospitals: [
            {
              name: "Rajbari General Hospital",
              type: "Government",
              address: "Rajbari Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Rajbari",
            },
          ],
        },
        {
          name: "Shariatpur",
          hospitals: [
            {
              name: "Shariatpur General Hospital",
              type: "Government",
              address: "Shariatpur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Shariatpur",
            },
          ],
        },
      ],
    },
    {
      name: "Chattogram",
      districts: [
        {
          name: "Chattogram",
          hospitals: [
            // Government
            {
              name: "Chittagong Medical College Hospital",
              type: "Government",
              address: "K.B. Fazlul Kader Road, Chattogram",
            },
            {
              name: "Chattogram General Hospital",
              type: "Government",
              address: "Anderkilla, Chattogram",
            },
            {
              name: "Chittagong Eye Infirmary & Training Complex",
              type: "Government",
              address: "Pahartali, Chattogram",
            },
            {
              name: "250 Bed TB Hospital",
              type: "Government",
              address: "Chattogram",
            },
            // Private
            {
              name: "Imperial Hospital Ltd",
              type: "Private",
              address: "Nasirabad, Chattogram",
            },
            {
              name: "Chevron Clinical Laboratory",
              type: "Private",
              address: "OR Nizam Road, Chattogram",
            },
            {
              name: "Max Hospital Chattogram",
              type: "Private",
              address: "Agrabad, Chattogram",
            },
            {
              name: "Parkview Hospital",
              type: "Private",
              address: "Agrabad, Chattogram",
            },
            {
              name: "Chattogram Metropolitan Hospital",
              type: "Private",
              address: "Dampara, Chattogram",
            },
            {
              name: "CSCR Hospital",
              type: "Private",
              address: "Muradpur, Chattogram",
            },
            {
              name: "Evercare Hospital Chattogram",
              type: "Private",
              address: "O.R. Nizam Road, Chattogram",
            },
            {
              name: "Chattogram Maa-O-Shishu Hospital",
              type: "Private",
              address: "Agrabad, Chattogram",
            },
            {
              name: "National Hospital Chattogram",
              type: "Private",
              address: "Mehedibag, Chattogram",
            },
            {
              name: "CMOSH Hospital",
              type: "Private",
              address: "Agrabad, Chattogram",
            },
            {
              name: "Diabetic Hospital Chattogram",
              type: "Private",
              address: "Dampara, Chattogram",
            },
            {
              name: "Chattogram Eye Hospital",
              type: "Private",
              address: "Dampara, Chattogram",
            },
            {
              name: "Samorita Hospital",
              type: "Private",
              address: "Halishahar, Chattogram",
            },
            {
              name: "Union Medical College Hospital",
              type: "Private",
              address: "Panchlaish, Chattogram",
            },
          ],
        },
        {
          name: "Cox's Bazar",
          hospitals: [
            {
              name: "Cox's Bazar Sadar Hospital",
              type: "Government",
              address: "Cox's Bazar Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Cox's Bazar",
            },
            {
              name: "Cox's Bazar Medical College Hospital",
              type: "Government",
              address: "Cox's Bazar",
            },
            {
              name: "Labaid Specialized Hospital",
              type: "Private",
              address: "Cox's Bazar",
            },
          ],
        },
        {
          name: "Comilla",
          hospitals: [
            {
              name: "Comilla Medical College Hospital",
              type: "Government",
              address: "Comilla",
            },
            {
              name: "Comilla General Hospital",
              type: "Government",
              address: "Comilla Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Comilla",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Comilla",
            },
          ],
        },
        {
          name: "Feni",
          hospitals: [
            {
              name: "Feni General Hospital",
              type: "Government",
              address: "Feni Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Feni",
            },
          ],
        },
        {
          name: "Noakhali",
          hospitals: [
            {
              name: "Noakhali General Hospital",
              type: "Government",
              address: "Noakhali Sadar",
            },
            {
              name: "250 Bed District Hospital",
              type: "Government",
              address: "Noakhali",
            },
          ],
        },
        {
          name: "Lakshmipur",
          hospitals: [
            {
              name: "Lakshmipur General Hospital",
              type: "Government",
              address: "Lakshmipur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Lakshmipur",
            },
          ],
        },
        {
          name: "Chandpur",
          hospitals: [
            {
              name: "Chandpur General Hospital",
              type: "Government",
              address: "Chandpur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Chandpur",
            },
          ],
        },
        {
          name: "Brahmanbaria",
          hospitals: [
            {
              name: "Brahmanbaria General Hospital",
              type: "Government",
              address: "Brahmanbaria Sadar",
            },
            {
              name: "250 Bed District Hospital",
              type: "Government",
              address: "Brahmanbaria",
            },
          ],
        },
        {
          name: "Rangamati",
          hospitals: [
            {
              name: "Rangamati General Hospital",
              type: "Government",
              address: "Rangamati Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Rangamati",
            },
          ],
        },
        {
          name: "Khagrachhari",
          hospitals: [
            {
              name: "Khagrachhari General Hospital",
              type: "Government",
              address: "Khagrachhari Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Khagrachhari",
            },
          ],
        },
        {
          name: "Bandarban",
          hospitals: [
            {
              name: "Bandarban General Hospital",
              type: "Government",
              address: "Bandarban Sadar",
            },
            {
              name: "50 Bed District Hospital",
              type: "Government",
              address: "Bandarban",
            },
          ],
        },
      ],
    },
    {
      name: "Rajshahi",
      districts: [
        {
          name: "Rajshahi",
          hospitals: [
            {
              name: "Rajshahi Medical College Hospital",
              type: "Government",
              address: "Rajshahi",
            },
            {
              name: "Rajshahi General Hospital",
              type: "Government",
              address: "Rajshahi Sadar",
            },
            {
              name: "Islami Bank Medical College Hospital",
              type: "Private",
              address: "Rajshahi",
            },
            {
              name: "Barind Medical College Hospital",
              type: "Private",
              address: "Rajshahi",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Rajshahi",
            },
            {
              name: "Rajshahi Diabetic Association Hospital",
              type: "Private",
              address: "Rajshahi",
            },
          ],
        },
        {
          name: "Bogura",
          hospitals: [
            {
              name: "Shaheed Ziaur Rahman Medical College Hospital",
              type: "Government",
              address: "Bogura",
            },
            {
              name: "Bogura General Hospital",
              type: "Government",
              address: "Bogura Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Bogura",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Bogura",
            },
          ],
        },
        {
          name: "Pabna",
          hospitals: [
            {
              name: "Pabna Medical College Hospital",
              type: "Government",
              address: "Pabna",
            },
            {
              name: "Pabna Mental Hospital",
              type: "Government",
              address: "Hemayetpur, Pabna",
            },
            {
              name: "100 Bed General Hospital",
              type: "Government",
              address: "Pabna",
            },
          ],
        },
        {
          name: "Sirajganj",
          hospitals: [
            {
              name: "Sirajganj General Hospital",
              type: "Government",
              address: "Sirajganj Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Sirajganj",
            },
          ],
        },
        {
          name: "Natore",
          hospitals: [
            {
              name: "Natore General Hospital",
              type: "Government",
              address: "Natore Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Natore",
            },
          ],
        },
        {
          name: "Naogaon",
          hospitals: [
            {
              name: "Naogaon General Hospital",
              type: "Government",
              address: "Naogaon Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Naogaon",
            },
          ],
        },
        {
          name: "Nawabganj",
          hospitals: [
            {
              name: "Nawabganj General Hospital",
              type: "Government",
              address: "Nawabganj Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Nawabganj",
            },
          ],
        },
        {
          name: "Joypurhat",
          hospitals: [
            {
              name: "Joypurhat General Hospital",
              type: "Government",
              address: "Joypurhat Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Joypurhat",
            },
          ],
        },
      ],
    },
    {
      name: "Khulna",
      districts: [
        {
          name: "Khulna",
          hospitals: [
            {
              name: "Khulna Medical College Hospital",
              type: "Government",
              address: "Khulna",
            },
            {
              name: "Khulna General Hospital",
              type: "Government",
              address: "Khulna Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Khulna",
            },
            {
              name: "Gazi Medical College Hospital",
              type: "Private",
              address: "Khulna",
            },
            {
              name: "Ad-din Hospital Khulna",
              type: "Private",
              address: "Khulna",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Khulna",
            },
          ],
        },
        {
          name: "Jessore",
          hospitals: [
            {
              name: "Jessore Medical College Hospital",
              type: "Government",
              address: "Jessore",
            },
            {
              name: "Jessore General Hospital",
              type: "Government",
              address: "Jessore Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Jessore",
            },
          ],
        },
        {
          name: "Satkhira",
          hospitals: [
            {
              name: "Satkhira Sadar Hospital",
              type: "Government",
              address: "Satkhira Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Satkhira",
            },
          ],
        },
        {
          name: "Kushtia",
          hospitals: [
            {
              name: "Kushtia Medical College Hospital",
              type: "Government",
              address: "Kushtia",
            },
            {
              name: "Kushtia General Hospital",
              type: "Government",
              address: "Kushtia Sadar",
            },
          ],
        },
        {
          name: "Meherpur",
          hospitals: [
            {
              name: "Meherpur General Hospital",
              type: "Government",
              address: "Meherpur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Meherpur",
            },
          ],
        },
        {
          name: "Chuadanga",
          hospitals: [
            {
              name: "Chuadanga General Hospital",
              type: "Government",
              address: "Chuadanga Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Chuadanga",
            },
          ],
        },
        {
          name: "Jhenaidah",
          hospitals: [
            {
              name: "Jhenaidah General Hospital",
              type: "Government",
              address: "Jhenaidah Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Jhenaidah",
            },
          ],
        },
        {
          name: "Magura",
          hospitals: [
            {
              name: "Magura General Hospital",
              type: "Government",
              address: "Magura Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Magura",
            },
          ],
        },
        {
          name: "Narail",
          hospitals: [
            {
              name: "Narail General Hospital",
              type: "Government",
              address: "Narail Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Narail",
            },
          ],
        },
        {
          name: "Bagerhat",
          hospitals: [
            {
              name: "Bagerhat General Hospital",
              type: "Government",
              address: "Bagerhat Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Bagerhat",
            },
          ],
        },
      ],
    },
    {
      name: "Barishal",
      districts: [
        {
          name: "Barishal",
          hospitals: [
            {
              name: "Sher-e-Bangla Medical College Hospital",
              type: "Government",
              address: "Barishal",
            },
            {
              name: "Barishal General Hospital",
              type: "Government",
              address: "Barishal Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Barishal",
            },
            {
              name: "Ad-din Sakina Medical College Hospital",
              type: "Private",
              address: "Barishal",
            },
          ],
        },
        {
          name: "Patuakhali",
          hospitals: [
            {
              name: "Patuakhali Medical College Hospital",
              type: "Government",
              address: "Patuakhali",
            },
            {
              name: "Patuakhali General Hospital",
              type: "Government",
              address: "Patuakhali Sadar",
            },
          ],
        },
        {
          name: "Bhola",
          hospitals: [
            {
              name: "Bhola General Hospital",
              type: "Government",
              address: "Bhola Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Bhola",
            },
          ],
        },
        {
          name: "Pirojpur",
          hospitals: [
            {
              name: "Pirojpur General Hospital",
              type: "Government",
              address: "Pirojpur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Pirojpur",
            },
          ],
        },
        {
          name: "Jhalokati",
          hospitals: [
            {
              name: "Jhalokati General Hospital",
              type: "Government",
              address: "Jhalokati Sadar",
            },
            {
              name: "50 Bed District Hospital",
              type: "Government",
              address: "Jhalokati",
            },
          ],
        },
        {
          name: "Barguna",
          hospitals: [
            {
              name: "Barguna General Hospital",
              type: "Government",
              address: "Barguna Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Barguna",
            },
          ],
        },
      ],
    },
    {
      name: "Sylhet",
      districts: [
        {
          name: "Sylhet",
          hospitals: [
            {
              name: "Sylhet MAG Osmani Medical College Hospital",
              type: "Government",
              address: "Sylhet",
            },
            {
              name: "Sylhet Women's Medical College Hospital",
              type: "Private",
              address: "Sylhet",
            },
            {
              name: "Mount Adora Hospital",
              type: "Private",
              address: "Zindabazar, Sylhet",
            },
            {
              name: "Ibn Sina Hospital Sylhet",
              type: "Private",
              address: "Sylhet",
            },
            {
              name: "Jalalabad Ragib-Rabeya Medical College Hospital",
              type: "Private",
              address: "Sylhet",
            },
            {
              name: "North East Medical College Hospital",
              type: "Private",
              address: "Sylhet",
            },
            {
              name: "Parkview Medical College Hospital",
              type: "Private",
              address: "Sylhet",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Sylhet",
            },
          ],
        },
        {
          name: "Moulvibazar",
          hospitals: [
            {
              name: "Moulvibazar General Hospital",
              type: "Government",
              address: "Moulvibazar Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Moulvibazar",
            },
          ],
        },
        {
          name: "Habiganj",
          hospitals: [
            {
              name: "Habiganj General Hospital",
              type: "Government",
              address: "Habiganj Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Habiganj",
            },
          ],
        },
        {
          name: "Sunamganj",
          hospitals: [
            {
              name: "Sunamganj General Hospital",
              type: "Government",
              address: "Sunamganj Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Sunamganj",
            },
          ],
        },
      ],
    },
    {
      name: "Rangpur",
      districts: [
        {
          name: "Rangpur",
          hospitals: [
            {
              name: "Rangpur Medical College Hospital",
              type: "Government",
              address: "Rangpur",
            },
            {
              name: "Rangpur General Hospital",
              type: "Government",
              address: "Rangpur Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Rangpur",
            },
            {
              name: "Begum Rokeya Medical College Hospital",
              type: "Government",
              address: "Rangpur",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Rangpur",
            },
          ],
        },
        {
          name: "Dinajpur",
          hospitals: [
            {
              name: "Dinajpur Medical College Hospital",
              type: "Government",
              address: "Dinajpur",
            },
            {
              name: "Dinajpur General Hospital",
              type: "Government",
              address: "Dinajpur Sadar",
            },
            {
              name: "250 Bed General Hospital",
              type: "Government",
              address: "Dinajpur",
            },
          ],
        },
        {
          name: "Kurigram",
          hospitals: [
            {
              name: "Kurigram General Hospital",
              type: "Government",
              address: "Kurigram Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Kurigram",
            },
          ],
        },
        {
          name: "Gaibandha",
          hospitals: [
            {
              name: "Gaibandha General Hospital",
              type: "Government",
              address: "Gaibandha Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Gaibandha",
            },
          ],
        },
        {
          name: "Nilphamari",
          hospitals: [
            {
              name: "Nilphamari General Hospital",
              type: "Government",
              address: "Nilphamari Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Nilphamari",
            },
          ],
        },
        {
          name: "Lalmonirhat",
          hospitals: [
            {
              name: "Lalmonirhat General Hospital",
              type: "Government",
              address: "Lalmonirhat Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Lalmonirhat",
            },
          ],
        },
        {
          name: "Thakurgaon",
          hospitals: [
            {
              name: "Thakurgaon General Hospital",
              type: "Government",
              address: "Thakurgaon Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Thakurgaon",
            },
          ],
        },
        {
          name: "Panchagarh",
          hospitals: [
            {
              name: "Panchagarh General Hospital",
              type: "Government",
              address: "Panchagarh Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Panchagarh",
            },
          ],
        },
      ],
    },
    {
      name: "Mymensingh",
      districts: [
        {
          name: "Mymensingh",
          hospitals: [
            {
              name: "Mymensingh Medical College Hospital",
              type: "Government",
              address: "Mymensingh",
            },
            {
              name: "Mymensingh General Hospital",
              type: "Government",
              address: "Mymensingh Sadar",
            },
            {
              name: "Community Based Medical College Hospital",
              type: "Private",
              address: "Mymensingh",
            },
            {
              name: "Popular Diagnostic Centre",
              type: "Private",
              address: "Mymensingh",
            },
          ],
        },
        {
          name: "Jamalpur",
          hospitals: [
            {
              name: "Jamalpur General Hospital",
              type: "Government",
              address: "Jamalpur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Jamalpur",
            },
          ],
        },
        {
          name: "Sherpur",
          hospitals: [
            {
              name: "Sherpur General Hospital",
              type: "Government",
              address: "Sherpur Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Sherpur",
            },
          ],
        },
        {
          name: "Netrokona",
          hospitals: [
            {
              name: "Netrokona General Hospital",
              type: "Government",
              address: "Netrokona Sadar",
            },
            {
              name: "100 Bed District Hospital",
              type: "Government",
              address: "Netrokona",
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Get all hospitals (flat list)
 */
function getAllHospitals() {
  const hospitals = [];
  BD_HOSPITALS.divisions.forEach((division) => {
    division.districts.forEach((district) => {
      district.hospitals.forEach((hospital) => {
        hospitals.push({
          ...hospital,
          district: district.name,
          division: division.name,
        });
      });
    });
  });
  return hospitals;
}

/**
 * Get hospitals by division
 */
function getHospitalsByDivision(divisionName) {
  const division = BD_HOSPITALS.divisions.find((d) => d.name === divisionName);
  if (!division) return [];

  const hospitals = [];
  division.districts.forEach((district) => {
    district.hospitals.forEach((hospital) => {
      hospitals.push({
        ...hospital,
        district: district.name,
        division: division.name,
      });
    });
  });
  return hospitals;
}

/**
 * Get hospitals by district
 */
function getHospitalsByDistrict(divisionName, districtName) {
  const division = BD_HOSPITALS.divisions.find((d) => d.name === divisionName);
  if (!division) return [];

  const district = division.districts.find((d) => d.name === districtName);
  if (!district) return [];

  return district.hospitals.map((hospital) => ({
    ...hospital,
    district: district.name,
    division: division.name,
  }));
}

/**
 * Search hospitals by name
 */
function searchHospitals(query) {
  const hospitals = getAllHospitals();
  const lowerQuery = query.toLowerCase();
  return hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(lowerQuery) ||
      h.district.toLowerCase().includes(lowerQuery) ||
      h.division.toLowerCase().includes(lowerQuery)
  );
}

// Export for use in browser
if (typeof window !== "undefined") {
  window.BD_HOSPITALS = BD_HOSPITALS;
  window.getAllHospitals = getAllHospitals;
  window.getHospitalsByDivision = getHospitalsByDivision;
  window.getHospitalsByDistrict = getHospitalsByDistrict;
  window.searchHospitals = searchHospitals;
}
