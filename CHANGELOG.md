## [1.1.2 - 1.1.6] - 2024-04-27
### Improved
- Improvements on `sendBase64UrlInChunks`.

## [1.1.1] - 2024-04-24
### Improved
- Refractored `addPageNumbers` function to allow passing the page height i.e., `addPageNumbers(850);` from front-end for more control.

## [1.1.0] - 2024-04-24
### Removed
- Removed page numbers from introductory statement.

## [1.0.9] - 2024-04-22
### Fix
- Modified calculations in the page numbering function.

## [1.0.8] - 2024-04-13
### Fix
- Fixed a bug in the share button of the nav.

## [1.0.7] - 2024-04-13
### Removed
- Reverted changes made in `v.1.0.6.x`.
- Sweet Alert styles from `printview_custom.css`

## [1.0.6.1] - 2024-04-13
### Removed
- Removed `<div id="-signature">{% if not doc.custom_signatures[0] %}<button class="-no-print openModalButton -modern-button" data-action="Sign Document">Sign Document</button>{% else %}<img src="{{doc.custom_signatures[0].signature_image}}">{% endif %}</div>` From the footer. Will be injected into `#-page-sign` later using JS.

## [1.0.6] - 2024-04-13
### Added
- Created the Jinja Block `mirage_footer` to be used universally within any print format. Use as `{{mirage_footer}}`

## [1.0.5.x] - 2024-04-13
### Fixed
- Multiple bugs related to the order functions are being run.

## [1.0.4] - 2024-04-13
### Improved
- Refractored `printview.html` by moving the logic responsible for menu share button to `printview_script.js`.

### UI
- Changed the icon for `shareButton` in `nav`.

### Fixed
- Fixed overlap and potential conflict in the event listeners of the `applyWatermark()` function.

## [1.0.3] - 2024-04-13
### Fixed
- Fixed a bug in `printview.html` (Replaced `{{doc.name}}` with `{{name}}` )

## [1.0.2] - 2024-04-13
### Added
- Attempting to run applyWatermark directly from `printview.html`


## [1.0.1] - 2024-04-13
### Added
- Added SweetAlert custom CSS styling.

### Changed
- Changed SWAL Styling.

### Deprecated
- Deprecated `drawDynamicTextOnCanvas()` in favor of `applyWatermark(docName)`.
- Deprecated the old modal in favor of `Sweet Alert`.

### Removed
- Removed `drawDynamicTextOnCanvas()`.