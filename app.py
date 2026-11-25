import pandas as pd
import streamlit as st

import database as db

st.set_page_config(
    page_title="CRN | Circular Resource Network",
    page_icon="♻️",
    layout="wide",
)

db.initialize_database()

RESOURCE_TYPES = [
    "Waste Heat", "Water", "Wastewater", "Brine",
    "Plastic Waste", "Organic Waste", "Metal Waste", "Other"
]
FACILITY_TYPES = [
    "Data Center", "Power Plant", "Manufacturing Industry",
    "Steel Plant", "Cement Plant", "Desalination Plant",
    "Greenhouse", "Agricultural Facility", "Building", "Other"
]
UNITS = ["kW", "MW", "Litres/day", "m³/day", "kg/day", "tonnes/day"]

st.sidebar.title("♻️ CRN")
st.sidebar.caption("Circular Resource Network")
page = st.sidebar.radio(
    "Navigation",
    ["Dashboard", "Add Resource Source", "Add Resource Consumer",
     "View Resources", "Manage Records"],
)
st.sidebar.divider()
st.sidebar.caption("Phase 1 · Resource registration")

def records_to_frame(records, columns):
    return pd.DataFrame(records, columns=columns) if records else pd.DataFrame(columns=columns)

def show_source_table():
    rows = db.get_sources()
    columns = ["ID", "Facility", "Facility Type", "Resource", "Quantity",
               "Unit", "Temperature °C", "Location", "Description", "Created At"]
    st.dataframe(records_to_frame(rows, columns), use_container_width=True, hide_index=True)

def show_consumer_table():
    rows = db.get_consumers()
    columns = ["ID", "Facility", "Facility Type", "Required Resource",
               "Required Quantity", "Unit", "Required Temperature °C",
               "Location", "Description", "Created At"]
    st.dataframe(records_to_frame(rows, columns), use_container_width=True, hide_index=True)

if page == "Dashboard":
    st.title("Circular Resource Network")
    st.write("A platform for recording available resources and resource requirements.")
    sources, consumers = db.get_counts()
    c1, c2, c3 = st.columns(3)
    c1.metric("Resource sources", sources)
    c2.metric("Resource consumers", consumers)
    c3.metric("Total records", sources + consumers)
    st.divider()
    st.subheader("How CRN works")
    a, b, c = st.columns(3)
    a.info("**1. Register sources**\n\nRecord waste heat, water, brine or reusable materials.")
    b.info("**2. Register demand**\n\nRecord facilities that need a particular resource.")
    c.info("**3. Prepare for matching**\n\nPhase 2 will compare sources and consumers for compatibility.")
    st.subheader("Recently added sources")
    recent = db.get_sources()[:5]
    if recent:
        show_source_table()
    else:
        st.caption("No sources registered yet. Use the sidebar to add one.")

elif page == "Add Resource Source":
    st.title("Add a Resource Source")
    st.caption("Register a facility that has a resource available for possible reuse.")
    with st.form("source_form", clear_on_submit=True):
        name = st.text_input("Facility name")
        facility_type = st.selectbox("Facility type", FACILITY_TYPES)
        resource = st.selectbox("Available resource", RESOURCE_TYPES)
        quantity = st.number_input("Available quantity", min_value=0.001, value=1.0, step=1.0)
        unit = st.selectbox("Unit", UNITS)
        temperature = st.number_input("Temperature (°C)", value=0.0, step=1.0,
                                      help="Enter a value for heat resources; otherwise leave as 0.")
        location = st.text_input("Location (city/area)")
        description = st.text_area("Description (optional)")
        submitted = st.form_submit_button("Save resource source", type="primary")
    if submitted:
        if not name.strip() or not location.strip():
            st.error("Facility name and location are required.")
        else:
            db.add_source((
                name.strip(), facility_type, resource, float(quantity), unit,
                float(temperature) if resource == "Waste Heat" else None,
                location.strip(), description.strip()
            ))
            st.success("Resource source saved.")
            st.rerun()

elif page == "Add Resource Consumer":
    st.title("Add a Resource Consumer")
    st.caption("Register a facility that requires a resource.")
    with st.form("consumer_form", clear_on_submit=True):
        name = st.text_input("Facility name")
        facility_type = st.selectbox("Facility type", FACILITY_TYPES)
        resource = st.selectbox("Required resource", RESOURCE_TYPES)
        quantity = st.number_input("Required quantity", min_value=0.001, value=1.0, step=1.0)
        unit = st.selectbox("Unit", UNITS)
        temperature = st.number_input("Required temperature (°C)", value=0.0, step=1.0,
                                      help="Relevant mainly for heat requirements.")
        location = st.text_input("Location (city/area)")
        description = st.text_area("Additional requirements (optional)")
        submitted = st.form_submit_button("Save resource consumer", type="primary")
    if submitted:
        if not name.strip() or not location.strip():
            st.error("Facility name and location are required.")
        else:
            db.add_consumer((
                name.strip(), facility_type, resource, float(quantity), unit,
                float(temperature) if resource == "Waste Heat" else None,
                location.strip(), description.strip()
            ))
            st.success("Resource consumer saved.")
            st.rerun()

elif page == "View Resources":
    st.title("Registered Resources")
    tab1, tab2 = st.tabs(["Available sources", "Resource consumers"])
    with tab1:
        show_source_table()
    with tab2:
        show_consumer_table()

elif page == "Manage Records":
    st.title("Manage Records")
    st.warning("Deleting a record is permanent for this database.")
    tab1, tab2 = st.tabs(["Delete sources", "Delete consumers"])
    with tab1:
        sources = db.get_sources()
        if sources:
            options = {f'#{r[0]} · {r[1]} · {r[3]}': r[0] for r in sources}
            selected = st.selectbox("Choose a source", list(options), key="source_delete")
            confirm = st.checkbox("I confirm that I want to delete this source.", key="confirm_source")
            if st.button("Delete source", type="primary", disabled=not confirm):
                db.delete_source(options[selected])
                st.success("Source deleted.")
                st.rerun()
        else:
            st.info("There are no sources to delete.")
    with tab2:
        consumers = db.get_consumers()
        if consumers:
            options = {f'#{r[0]} · {r[1]} · {r[3]}': r[0] for r in consumers}
            selected = st.selectbox("Choose a consumer", list(options), key="consumer_delete")
            confirm = st.checkbox("I confirm that I want to delete this consumer.", key="confirm_consumer")
            if st.button("Delete consumer", type="primary", disabled=not confirm):
                db.delete_consumer(options[selected])
                st.success("Consumer deleted.")
                st.rerun()
        else:
            st.info("There are no consumers to delete.")

st.sidebar.divider()
st.sidebar.caption("CRN prototype · Phase 1")
