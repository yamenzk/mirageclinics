## [1.0.5] - 2024-04-13
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