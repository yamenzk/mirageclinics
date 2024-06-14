from frappe.core.doctype.file.file import File

class CustomFile(File):
    def after_insert(self):
        if not self.is_folder:
            self.create_attachment_record()
        
        if self.owner != "Guest":
            self.set_is_private()
        
        self.set_file_name()
        self.validate_duplicate_entry()