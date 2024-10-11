import { FormattedSalonFormValues, SalonPostObject } from "@utils/types";
import { SALON_TYPE, CATEGORY, LOCATION_TYPE, Salon } from "@prisma/client";

export const mockedUser = {
  fullname: "Timothy Lim",
  email: "timothylim23@gmail.com",
  bio: "I’m the founder of Interintellect and one of its most active hosts. My topics range from literature to psychology and philosophy, from music to art and cultural studies, from theology to world affairs, technology, and history.",
  profileImageUrl: "https://www.timothylim.is/_next/image?url=%2Fprofile.png&w=828&q=75",
  slug: "timothy"
};

export const mockedSalons: SalonPostObject[] = [
  {
    title: "The Science of Meditation 1",
    description: "Exploring the scientific benefits of meditation.",
    startTime: new Date("2022-01-15T10:00:00Z"),
    endTime: new Date("2022-01-15T12:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 10,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "meditation.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Science of Meditation 2",
    description: "Exploring the scientific benefits of meditation.",
    startTime: new Date("2022-01-15T10:00:00Z"),
    endTime: new Date("2022-01-15T12:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 10,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "meditation.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Science of Meditation 3",
    description: "Exploring the scientific benefits of meditation.",
    startTime: new Date("2022-01-15T10:00:00Z"),
    endTime: new Date("2022-01-15T12:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 10,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "meditation.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Science of Meditation 4",
    description: "Exploring the scientific benefits of meditation.",
    startTime: new Date("2022-01-15T10:00:00Z"),
    endTime: new Date("2022-01-15T12:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 10,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "meditation.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Science of Meditation 5",
    description: "Exploring the scientific benefits of meditation.",
    startTime: new Date("2022-01-15T10:00:00Z"),
    endTime: new Date("2022-01-15T12:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 10,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "meditation.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Future of AI",
    description: "Discussing the potential impact of artificial intelligence.",
    startTime: new Date("2022-02-01T14:00:00Z"),
    endTime: new Date("2022-02-01T16:00:00Z"),
    memberSpaces: 15,
    publicSpaces: 5,
    publicPrice: 5,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "ai.png",
      mimetype: "image/png",
      size: 1500,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  // New entries
  {
    title: "Quantum Computing Basics",
    description: "An introduction to quantum computing and its future.",
    startTime: new Date("2022-03-05T09:00:00Z"),
    endTime: new Date("2022-03-05T11:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 15,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "quantum.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Mysteries of Dark Matter",
    description: "Exploring the unknowns of dark matter in the universe.",
    startTime: new Date("2022-04-10T13:00:00Z"),
    endTime: new Date("2022-04-10T15:00:00Z"),
    memberSpaces: 15,
    publicSpaces: 5,
    publicPrice: 20,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "darkmatter.png",
      mimetype: "image/png",
      size: 1500,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "Exploring the Human Genome",
    description: "A deep dive into genetics and what our DNA tells us.",
    startTime: new Date("2022-05-15T10:00:00Z"),
    endTime: new Date("2022-05-15T12:00:00Z"),
    memberSpaces: 20,
    publicSpaces: 10,
    publicPrice: 25,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "genome.png",
      mimetype: "image/png",
      size: 2000,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
  {
    title: "The Physics of Black Holes",
    description: "Understanding black holes and their impact on physics.",
    startTime: new Date("2022-06-20T14:00:00Z"),
    endTime: new Date("2022-06-20T16:00:00Z"),
    memberSpaces: 15,
    publicSpaces: 5,
    publicPrice: 30,
    locationType: LOCATION_TYPE.IRL,
    type: SALON_TYPE.SALON,
    category: CATEGORY.SCIENCE,
    file: {
      buffer: Buffer.from(""),
      originalname: "blackholes.png",
      mimetype: "image/png",
      size: 1500,
      fieldname: "file",
      encoding: ""
    },
    recordEvent: false
  },
];