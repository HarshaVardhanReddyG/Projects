const am = [
  "Wifi", "Elevator", "External Power Source", "Free Parking on Premises", "Pool", "Piano",
  "Smoke alarm", "Fire Extingusher", "Carbon Monoxide Alarm", "First Aid Kit"
];

const rooms_am = [
  "TV", "Kitchen", "Washing Machine", "Air Conditioning",
 "Dedicated work space", "Essentials", "Ceiling Fan", "Fridge", "Micro Wave", 
];

const hotelsList = [
    {
      id: 1,
      imgURL : [
       "https://a0.muscache.com/im/pictures/14152ff7-28fa-48cc-9c90-ac787fb5bb6b.jpg?im_w=720",
       "https://a0.muscache.com/im/pictures/miso/Hosting-3251026/original/825da780-127b-4155-982b-2a958b436eb2.jpeg?im_w=720",
       "https://a0.muscache.com/im/pictures/a246b08e-5a1d-46f9-a75a-c4392fd670a7.jpg?im_w=720",
       "https://a0.muscache.com/im/pictures/ea3a10aa-645f-4754-a4a2-9a4920b2c17b.jpg?im_w=720",
       "https://a0.muscache.com/im/pictures/7c6b0039-39d1-4d45-b405-898481cd12c2.jpg?im_w=720",
      ],
      name: "Hotel 1",
      location : "Hyderabad",
      rating : "4.9",
      price: "1000",
      amenities : ["Elevator",  "Fire Extingusher"],
      rooms : [
        {
          amenities : ["TV", "Kitchen"],
        },
        {
          amenities : ["Fridge", "Micro Wave"]
        }
      ],
    },
    {
      id: 2,
      imgURL : ["https://a0.muscache.com/im/pictures/miso/Hosting-617063718566302384/original/717a4c2d-e8a9-4798-8378-0d878e0ed56e.jpeg?im_w=1200"], 
      name: "Hotel 2",
      location : "Mumbai",
      rating : "4.8",
      price: "1000",
      amenities : ["Elevator", "Wifi", "External Power Source" ],
      rooms : [
        {
          amenities : ["TV", "Kitchen"],
        },
        {
          amenities : ["Fridge", "Micro Wave"]
        }
      ],
    },
    {
      id: 3,
      imgURL : ["https://a0.muscache.com/im/pictures/2a1724ca-c902-4c82-b64a-215c2fd1e414.jpg?im_w=720"],
      name: "Hotel 3",
      location : "Delhi",
      rating : "4.7",
      price: "1100",
      amenities : ["Carbon Monoxide Alarm", "First Aid Kit" ],
      rooms : [
        {
          amenities : ["TV", "Kitchen"],
        },
        {
          amenities : ["Fridge", "Micro Wave"]
        }
      ],
    },
    {
        id: 4,
        imgURL : ["https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720"],
        name: "Hotel 4",
        location : "Chennai",
        rating : "4.6",
        price: "1100",
        amenities : ["Elevator", "Wifi" ],
        rooms : [
          {
            amenities : ["TV", "Kitchen"],
          },
          {
            amenities : ["Dedicated work space", "Essentials"]
          }

        ],
    },
    {
        id: 5,
        imgURL : ["https://a0.muscache.com/im/pictures/miso/Hosting-9211435/original/544ef703-7834-43d7-95d6-af2f2d1aa21f.jpeg?im_w=720"],
        name: "Hotel 5",
        location : "Banglore",
        rating : "4.5",
        price: "1200",
        amenities : ["Elevator", "Wifi" ],
        rooms : [
          {
            amenities : ["TV", "Kitchen"],
          },
          {
            amenities : ["Dedicated work space", "Essentials"]
          }
        ],
    },
    {
        id: 6,
        imgURL : ["https://a0.muscache.com/im/pictures/ae71d719-bb9b-466d-aa76-c29a1d43afd7.jpg?im_w=720"],
        name: "Hotel 6",
        location : "Kolkata",
        rating : "4.5",
        price: "1200",
        amenities : ["Smoke alarm", "Fire Extingusher"],
        rooms : [
          {
            amenities : ["TV", "Kitchen"],
          },
        ],
    },
    {
      id: 7,
      imgURL : ["https://a0.muscache.com/im/pictures/ae71d719-bb9b-466d-aa76-c29a1d43afd7.jpg?im_w=720"],
      name: "Hotel 6",
      location : "Kolkata",
      rating : "4.4",
      price: "1300",
      amenities : ["Elevator", "Wifi" ],
      rooms : [
        {
          amenities : ["TV", "Kitchen"],
        },
      ],
  },
  {
    id: 8,
    imgURL : ["https://a0.muscache.com/im/pictures/miso/Hosting-9211435/original/544ef703-7834-43d7-95d6-af2f2d1aa21f.jpeg?im_w=720"],
    name: "Hotel 5",
    location : "Banglore",
    rating : "4.4",
    price: "1300",
    amenities : ["Elevator", "Wifi" ],
    rooms : [
      {
        amenities : ["TV", "Kitchen"],
      },
    ],
},
{
  id: 9,
  imgURL : ["https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720"],
  name: "Hotel 4",
  location : "Chennai",
  rating : "4.2",
  price: "1400",
  amenities : ["Elevator", "Wifi" ],
  rooms : [
    {
      amenities : ["TV", "Kitchen"],
    },
  ],
},
{
  id: 10,
  imgURL : ["https://a0.muscache.com/im/pictures/2a1724ca-c902-4c82-b64a-215c2fd1e414.jpg?im_w=720"],
  name: "Hotel 3",
  location : "Delhi",
  rating : "4.3",
  price: "1400",
  amenities : ["Elevator", "Wifi" ],
  rooms : [
    {
      amenities : ["TV", "Kitchen"],
    },
  ],
},
{
  id: 11,
  imgURL : [
   "https://a0.muscache.com/im/pictures/14152ff7-28fa-48cc-9c90-ac787fb5bb6b.jpg?im_w=720",
   "https://a0.muscache.com/im/pictures/miso/Hosting-3251026/original/825da780-127b-4155-982b-2a958b436eb2.jpeg?im_w=720",
   "https://a0.muscache.com/im/pictures/a246b08e-5a1d-46f9-a75a-c4392fd670a7.jpg?im_w=720",
   "https://a0.muscache.com/im/pictures/ea3a10aa-645f-4754-a4a2-9a4920b2c17b.jpg?im_w=720",
   "https://a0.muscache.com/im/pictures/7c6b0039-39d1-4d45-b405-898481cd12c2.jpg?im_w=720",
  ],
  name: "Hotel 1",
  location : "Hyderabad",
  rating : "5",
  price: "1500",
  amenities : ["Elevator", "Wifi" ],
  rooms : [
    {
      amenities : ["TV", "Kitchen"],
    },
  ],
},

{
  id: 12,
  imgURL : [
   "https://a0.muscache.com/im/pictures/14152ff7-28fa-48cc-9c90-ac787fb5bb6b.jpg?im_w=720",
   "https://a0.muscache.com/im/pictures/miso/Hosting-3251026/original/825da780-127b-4155-982b-2a958b436eb2.jpeg?im_w=720",
   "https://a0.muscache.com/im/pictures/a246b08e-5a1d-46f9-a75a-c4392fd670a7.jpg?im_w=720",
   "https://a0.muscache.com/im/pictures/ea3a10aa-645f-4754-a4a2-9a4920b2c17b.jpg?im_w=720",
   "https://a0.muscache.com/im/pictures/7c6b0039-39d1-4d45-b405-898481cd12c2.jpg?im_w=720",
  ],
  name: "Hotel 1",
  location : "Hyderabad",
  rating : "4.7",
  price: "1500",
  amenities : ["Elevator", "Wifi" ],
  rooms : [
    {
      amenities : ["TV", "Kitchen"],
    },
  ],
}

  ];
  
  export default hotelsList;