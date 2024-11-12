export interface Button {
    text: string;
    url: string;
}

export interface HeroSection {
    title: string;
    subTitle: string;
    buttons: Button[];
}

export interface PartnersSection {
    title: string;
    imageUrl: string;
}


export interface MostOfInterintellectCard {
    title: string;
    cardImg: string;
    buttonUrl: string;
    buttonTitle: string;
    description: string;
}

export interface AboutUsSection {
    title: string;
    subTitle: string;
    description: string;
    logoUrl: string;
    aboutUsImgUrl: string;
}

export interface TeamMember {
    name: string;
    description: string;
    imgUrl: string;
}

export interface Testimonial {
    comment: string;
    name: string;
    title: string;
}

export interface Subscription {
    imgUrl: string;
    name: string;
    annualPrice: number;
    monthlyPrice: number;
    perks: string[];
    buttonText: string;
}

export interface JoinCommunitySection {
    title: string;
    description: string;
    buttons: Button[];
    imgUrl: string;
}

interface SalonSection {
    title: string;
    salons: string[];
}

export interface SalonsSection {
    sectionTitle: string;
    category1: SalonSection;
    category2: SalonSection;
    category3: SalonSection;
    category4: SalonSection;
    button: {
        text: string;
        url: string;
    };
}

export interface HomePageDataValue {
    heroSection: HeroSection;
    partnersSection: PartnersSection;
    salonsSection: SalonsSection;
    aboutUsSection: AboutUsSection;
    teamMembersSection: TeamMember[];
    testimonialsSection: Testimonial[];
    subscriptionsSection: {
        title: string;
        membershipPageTitle: string;
        cards: Subscription[];
    };
    joinCommunitySection: JoinCommunitySection;
    mostofInterintellectCards: MostOfInterintellectCard[];
    salonsTabsSectionTitle?: string;
}

export interface HomePageData {
    value: HomePageDataValue;
}


export type FooterLink = {
    id: string;
    title: string;
    url: string;
};

export type SocialIcon = {
    id: string;
    image: {
        alt: string,
        imageUrl: string,
    },
    url: string,
};

export type FooterPageDataValue = {
    newsletterTitle: string;
    quoteText: string;
    footerText: string;
    footerLinks: FooterLink[];
    socialIcons: SocialIcon[];
};

export interface FooterPageData {
    value: FooterPageDataValue;
}

export type CommunityHeroSection = {
    title: string;
    subTitle: string;
    buttonText: string;
    buttonUrl: string;
};

type CommunityCardEntry = {
    title: string;
    description: string;
    imgUrl: string;
};

export type CommunityEventsSection = {
    title: string;
    description?: string;
    cards: CommunityCardEntry[];
};

export type CommunityCollectiveSparkSection = {
    text: string,
    name: string,
    jobTitle: string,
    image: string,
};

export type JoinUsSection = {
    title: string,
    description: string,
    buttonText: string,
    buttonUrl: string,
    image: string,
};

export type ExpectationsSection = {
    title: string,
    column1Title: string,
    column2Title: string,
    column3Title: string,
    column1List: string[],
    column2List: string[],
    column3List: string[],
};

export type MeetsSectionItem = {
    imageUrl: string,
    location: string,
};

export type CommunityPageDataValue = {
    heroSection: CommunityHeroSection;
    eventsSection: CommunityEventsSection;
    communityCollectiveSparkSection: CommunityCollectiveSparkSection;
    joinUsSection: JoinUsSection;
    expectationsSection: ExpectationsSection;
    meetsSection: MeetsSectionItem[];
};

export interface CommunityPageData {
    value: CommunityPageDataValue;
}