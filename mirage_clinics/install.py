from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def after_install():
    field = {
        "System Settings": [
            {
                "fieldname": "mirage_clinics_customizations",
                "label": "Mirage Clinics Customizations",
                "fieldtype": "Check",
                "insert_after": "disable_document_sharing"
            }
        ]
    }
    create_custom_fields(field)
