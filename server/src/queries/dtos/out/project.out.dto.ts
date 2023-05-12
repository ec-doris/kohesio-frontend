class ProjectProgram{
  programInfoRegioUrl: string;
  programmingPeriodLabel: string;
  programWebsite: string[];
  link: string;
  programFullLabel: string;
  programLabel: string
}

class ProjectFund{
  website: string;
  fullLabel: string;
  id: string;
  label: string;
}

class ProjectBeneficiary{
  website: string;
  link: string;
  beneficiaryLabel: string;
  wikidata: string;
}

class ProjectImage{
  image: string;
  imageCopyright: string;
}

export class ProjectOutDto {

  countryLabel: string[];
  projectWebsite: string;
  link: string;
  description: string;
  themeLabels: string[];
  videos: string[];
  regionUpper2: string;
  cofinancingRate: number;
  program: ProjectProgram[];
  regionUpper3: string;
  tweets: string[];
  regionUpper1: string;
  categoryIDs: string[];
  countryCode: string[];
  startTime: string;
  euBudget: string;
  funds: ProjectFund[];
  regionText: string;
  policyLabels: string[];
  beneficiaries: ProjectBeneficiary[];
  budget: string;
  item: string;
  images: ProjectImage[];
  geoJson: string[];
  infoRegioUrl: string;
  coordinates: string[];
  fundWebsite: string;
  policyIds: string[];
  label: string;
  managingAuthorityLabel: string;
  fundLabel: string;
  categoryLabels: string[];
  themeIds: string[];
  endTime: string;
  region: string;
  keepUrl: string;

}
