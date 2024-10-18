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

export interface HomePageData {
    heroSection: HeroSection;
    partnersSection: PartnersSection;
    aboutUsSection: AboutUsSection;
    teamMembersSection: TeamMember[];
    testimonialsSection: Testimonial[];
    subscriptionsSection: Subscription[];
    joinCommunitySection: JoinCommunitySection;
    mostofInterintellectCards: any[];
    salonsTabsSectionTitle?: string;
}
