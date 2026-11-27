// These lists mirror the hard-coded options in the existing app.py exactly.
export const FACILITY_TYPES = [
  "Data Center", "Power Plant", "Manufacturing Industry", "Steel Plant", "Cement Plant",
  "Desalination Plant", "Greenhouse", "Agricultural Facility", "Building", "Other",
];
export const RESOURCE_TYPES = [
  "Waste Heat", "Water", "Wastewater", "Brine",
  "Plastic Waste", "Organic Waste", "Metal Waste", "Other",
];
export const UNITS = ["kW", "MW", "Litres/day", "m³/day", "kg/day", "tonnes/day"];

export const HEAT_RESOURCE = "Waste Heat"; // temperature is only stored for this resource
export const HEAT_UNITS = ["kW", "MW"];
export const MIN_QUANTITY = 0.001;

export const RESOURCE_META = {
  "Waste Heat": { icon: "flame", tone: "heat", blurb: "Surplus thermal energy from servers, furnaces, turbines and processes." },
  "Water": { icon: "droplet", tone: "water", blurb: "Clean or treated water that one facility can pass to another." },
  "Wastewater": { icon: "waves", tone: "wastewater", blurb: "Process and effluent water that may suit irrigation or cooling." },
  "Brine": { icon: "flask", tone: "brine", blurb: "Concentrated salt solution, for example from desalination." },
  "Plastic Waste": { icon: "box", tone: "plastic", blurb: "Offcuts and scrap plastics that recyclers can use as feedstock." },
  "Organic Waste": { icon: "sprout", tone: "organic", blurb: "Biodegradable residues for composting or biogas." },
  "Metal Waste": { icon: "layers", tone: "metal", blurb: "Scrap and by-product metals ready for recovery." },
  "Other": { icon: "circle", tone: "other", blurb: "Any other reusable resource that does not fit the categories above." },
};

// Differences between the two record types: database field names and wording.
export const KIND_CONFIG = {
  source: {
    kind: "source", label: "source", plural: "sources",
    resourceKey: "resource_type", quantityKey: "quantity", temperatureKey: "temperature",
    resourceNoun: "available resource",
    resourceColumn: "Resource", quantityColumn: "Quantity", temperatureColumn: "Temperature",
  },
  consumer: {
    kind: "consumer", label: "consumer", plural: "consumers",
    resourceKey: "required_resource", quantityKey: "required_quantity", temperatureKey: "required_temperature",
    resourceNoun: "required resource",
    resourceColumn: "Required resource", quantityColumn: "Required quantity", temperatureColumn: "Required temperature",
  },
};
