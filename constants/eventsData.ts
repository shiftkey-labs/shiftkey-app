export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  image: any;
  details: {
    description: string;
    speaker: string;
    speakerImage: any;
    venue: string;
    venueAddress: string;
    time: string;
  };
  booked?: boolean;
}

const eventsData: Event[] = [
  {
    id: "1",
    title: "Say Hello to Open Source",
    location: "Goldberg",
    date: "Nov 19, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description:
        "Enjoy your favorite show and a lovely time with friends and family. Food from local food trucks will be available for purchase.",
      speaker: "Vansh Sood",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "430 Goldberg",
      venueAddress: "CS Building",
      time: "Tuesday, 4:00PM - 9:00PM",
    },
    booked: true,
  },
  {
    id: "2",
    title: "Say Hello to Blockchain",
    location: "Mccain",
    date: "Nov 20, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description: "Learn about the latest in blockchain technology.",
      speaker: "Jane Doe",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "123 McCain",
      venueAddress: "Engineering Building",
      time: "Wednesday, 2:00PM - 6:00PM",
    },
  },
  {
    id: "3",
    title: "Say Hello to Open Source",
    location: "Goldberg",
    date: "Nov 19, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description:
        "Enjoy your favorite show and a lovely time with friends and family. Food from local food trucks will be available for purchase.",
      speaker: "Vansh Sood",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "430 Goldberg",
      venueAddress: "CS Building",
      time: "Tuesday, 4:00PM - 9:00PM",
    },
  },
  {
    id: "4",
    title: "Say Hello to Blockchain",
    location: "Mccain",
    date: "Nov 20, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description: "Learn about the latest in blockchain technology.",
      speaker: "Jane Doe",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "123 McCain",
      venueAddress: "Engineering Building",
      time: "Wednesday, 2:00PM - 6:00PM",
    },
  },
  {
    id: "5",
    title: "Say Hello to Open Source",
    location: "Goldberg",
    date: "Nov 19, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description:
        "Enjoy your favorite show and a lovely time with friends and family. Food from local food trucks will be available for purchase.",
      speaker: "Vansh Sood",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "430 Goldberg",
      venueAddress: "CS Building",
      time: "Tuesday, 4:00PM - 9:00PM",
    },
  },
  {
    id: "6",
    title: "Say Hello to Blockchain",
    location: "Mccain",
    date: "Nov 20, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description: "Learn about the latest in blockchain technology.",
      speaker: "Jane Doe",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "123 McCain",
      venueAddress: "Engineering Building",
      time: "Wednesday, 2:00PM - 6:00PM",
    },
  },
  {
    id: "7",
    title: "Say Hello to Open Source",
    location: "Goldberg",
    date: "Nov 19, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description:
        "Enjoy your favorite show and a lovely time with friends and family. Food from local food trucks will be available for purchase.",
      speaker: "Vansh Sood",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "430 Goldberg",
      venueAddress: "CS Building",
      time: "Tuesday, 4:00PM - 9:00PM",
    },
  },
  {
    id: "8",
    title: "Say Hello to Blockchain",
    location: "Mccain",
    date: "Nov 20, 2022",
    image: require("@/assets/images/events/event1.png"),
    details: {
      description: "Learn about the latest in blockchain technology.",
      speaker: "Jane Doe",
      speakerImage: require("@/assets/images/events/vansh.png"),
      venue: "123 McCain",
      venueAddress: "Engineering Building",
      time: "Wednesday, 2:00PM - 6:00PM",
    },
  },
];

export default eventsData;
