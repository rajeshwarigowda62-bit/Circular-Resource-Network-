/**
 * DEMO DATA ONLY. These facilities are invented so the interface has something to show.
 * They are never read from, or written to, the real SQLite database.
 * Shapes match the real tables: see database.py.
 */
export const DEMO_SOURCES = [
  { id: 1, facility_name: "Demo Data Center A", facility_type: "Data Center", resource_type: "Waste Heat", quantity: 850, unit: "kW", temperature: 42, location: "Bengaluru", description: "Warm exhaust air from the cooling halls, available all year.", created_at: "2026-11-10 09:30:00", is_demo: true },
  { id: 2, facility_name: "Demo Thermal Power Station", facility_type: "Power Plant", resource_type: "Waste Heat", quantity: 12, unit: "MW", temperature: 95, location: "Chennai", description: "Low-grade heat from the condenser circuit.", created_at: "2026-11-11 14:05:00", is_demo: true },
  { id: 3, facility_name: "Demo Coastal Desalination Unit", facility_type: "Desalination Plant", resource_type: "Brine", quantity: 4200, unit: "m³/day", temperature: null, location: "Mangaluru", description: "Concentrated brine from reverse-osmosis trains.", created_at: "2026-11-13 11:20:00", is_demo: true },
  { id: 4, facility_name: "Demo Textile Cluster Treatment Plant", facility_type: "Manufacturing Industry", resource_type: "Wastewater", quantity: 1800, unit: "m³/day", temperature: null, location: "Tiruppur", description: "Treated process water, suitable for non-potable reuse.", created_at: "2026-11-15 16:45:00", is_demo: true },
  { id: 5, facility_name: "Demo Steel Works", facility_type: "Steel Plant", resource_type: "Metal Waste", quantity: 35, unit: "tonnes/day", temperature: null, location: "Visakhapatnam", description: "Mill scale and offcuts.", created_at: "2026-11-18 10:10:00", is_demo: true },
  { id: 6, facility_name: "Demo Agri-Processing Unit", facility_type: "Agricultural Facility", resource_type: "Organic Waste", quantity: 9, unit: "tonnes/day", temperature: null, location: "Mysuru", description: "Husks and pulp from seasonal processing.", created_at: "2026-11-20 08:55:00", is_demo: true },
  { id: 7, facility_name: "Demo Packaging Factory", facility_type: "Manufacturing Industry", resource_type: "Plastic Waste", quantity: 2.4, unit: "tonnes/day", temperature: null, location: "Pune", description: "", created_at: "2026-11-22 13:00:00", is_demo: true },
];

export const DEMO_CONSUMERS = [
  { id: 1, facility_name: "Demo Hydroponic Greenhouse", facility_type: "Greenhouse", required_resource: "Waste Heat", required_quantity: 600, unit: "kW", required_temperature: 35, location: "Bengaluru", description: "Needs steady low-temperature heat for winter growing.", created_at: "2026-11-12 10:00:00", is_demo: true },
  { id: 2, facility_name: "Demo District Cooling Building", facility_type: "Building", required_resource: "Waste Heat", required_quantity: 1.5, unit: "MW", required_temperature: 80, location: "Chennai", description: "Absorption chiller heat input.", created_at: "2026-11-14 15:30:00", is_demo: true },
  { id: 3, facility_name: "Demo Salt and Chemical Works", facility_type: "Manufacturing Industry", required_resource: "Brine", required_quantity: 3000, unit: "m³/day", required_temperature: null, location: "Mangaluru", description: "", created_at: "2026-11-16 09:15:00", is_demo: true },
  { id: 4, facility_name: "Demo Organic Farm Cooperative", facility_type: "Agricultural Facility", required_resource: "Water", required_quantity: 2500, unit: "m³/day", required_temperature: null, location: "Tiruppur", description: "Irrigation demand in the dry season.", created_at: "2026-11-19 12:40:00", is_demo: true },
  { id: 5, facility_name: "Demo Recycled Plastics Moulder", facility_type: "Manufacturing Industry", required_resource: "Plastic Waste", required_quantity: 3, unit: "tonnes/day", required_temperature: null, location: "Pune", description: "Clean polyethylene preferred.", created_at: "2026-11-21 17:05:00", is_demo: true },
  { id: 6, facility_name: "Demo Biogas Plant", facility_type: "Power Plant", required_resource: "Organic Waste", required_quantity: 12, unit: "tonnes/day", required_temperature: null, location: "Mysuru", description: "", created_at: "2026-11-23 09:00:00", is_demo: true },
];
