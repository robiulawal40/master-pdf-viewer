
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data'
import {addQueryArgs } from '@wordpress/url'

import { useEffect } from '@wordpress/element'

import { 
	useBlockProps,
	ColorPalette,
	InspectorControls,
	MediaPlaceholder,
	MediaUploadCheck,
	MediaUpload
} from '@wordpress/block-editor';

import { Panel, PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, Button } from '@wordpress/components';
import { more, pdf } from '@wordpress/icons';

import './editor.scss';

export default function Edit({ attributes, setAttributes, isSelected, setSelected }) {

	const siteUrl = useSelect( select => select( 'core' ).getSite() );

	const getIframeUrl = (queryArg)=>{
		if(siteUrl && siteUrl.url){
			return addQueryArgs(siteUrl.url+"/wp-content/plugins/master-pdf-viewer/pdf-js/web/viewer.html", queryArg);
		} 
		};

		// useEffect(()=>{
		// 	console.log("Selection Change", isSelected);
		// }, [isSelected]);

	const { 
		id, 
		file, 
		title,
		externalUrl,
		download,
		print,
		search,
		sidebar,
		presentationMode,
		openFile,
		editButton,
		cursorSelectTool,
		cursorHandTool,
		documentProperties,
		themeColor,
		width, 
		height,
		zoomLevel,
		defaultLandingPage,
		pageViewMode	
	} = attributes;

const onUpdateMedia = ({ id, url, title  })=>{
	setAttributes( { id, file:url, title  } );
	// console.log("after media update: attributes", attributes);
}

function updateAttribute(key) {
	return function (value) {
		const attr = {};
		attr[key] = value;
		setAttributes(attr);
	}
}

return (
<>	

<InspectorControls key="setting">

		<PanelBody title={__('PDF General Settings', 'mpv')} initialOpen={ false }>
			<div>
				<ToggleControl
					label={__('Download', 'mpv')}
					checked={download}
					onChange={updateAttribute('download')}
				/>
				<ToggleControl
					label={__('Print', 'mpv')}
					checked={print}
					onChange={updateAttribute('print')}
				/>
				<ToggleControl
					label={__('Search', 'mpv')}
					checked={search}
					onChange={updateAttribute('search')}
				/>
				<ToggleControl
					label={__('Sidebar', 'mpv')}
					checked={sidebar}
					onChange={updateAttribute('sidebar')}
				/>
				<ToggleControl
					label={__('Presentation Mode', 'mpv')}
					checked={presentationMode}
					onChange={updateAttribute('presentationMode')}
				/>
				<ToggleControl
					label={__('Open File', 'mpv')}
					checked={openFile}
					onChange={updateAttribute('openFile')}
				/>
				<ToggleControl
					label={__('Edit Button', 'mpv')}
					checked={editButton}
					onChange={updateAttribute('editButton')}
				/>
				<ToggleControl
					label={__('Cursor Hand Tool', 'mpv')}
					checked={cursorHandTool}
					onChange={updateAttribute('cursorHandTool')}
				/>
				<ToggleControl
					label={__('Document Properties', 'mpv')}
					checked={documentProperties}
					onChange={updateAttribute('documentProperties')}
				/>
			</div>
		</PanelBody>

		{/* <PanelBody title={__('PDF Theme Color', 'mpv')} initialOpen={ false }>
			<ColorPalette
				label={__('Theme Color', 'mpv')}
				value={ themeColor }
				onChange={ updateAttribute('themeColor') }
			/>
		</PanelBody> */}

		<PanelBody title="PDF Dimensions" initialOpen={ false }>
			<div>
				<TextControl
					type="string"
					min={20}
					label={__('Width', 'mpv')}
					value={undefined === width ? "400" : width}
					help={__('Default unit is px. To use percentage, add % sign after the number.', 'mpv')}
					onChange={updateAttribute('width')}
				/>
				<TextControl
					type="string"
					label={__('Height', 'mpv')}
					value={undefined === height ? "400" : height}
					min={1}
					help={__('Default unit is px. To use percentage, add % sign after the number.', 'mpv')}
					onChange={updateAttribute('height')}
				/>
			</div>
		</PanelBody>

		<PanelBody title={__('PDF Zoom Level', 'mpv')} initialOpen={ false }>
		<div>
				<SelectControl
				label={__('PDF Zoom', 'mpv')}
				value={zoomLevel}
				options={ [
					{ label: __('Automatic Zoom', 'mpv'), value: 'auto' },
					{ label: __('Actual Size', 'mpv'), value: 'page-actual' },
					{ label: __('Page Fit', 'mpv'), value: 'page-fit' },
					{ label: __('Page Width', 'mpv'), value: 'page-width' },
					{ label: __('50%', 'mpv'), value: '0.5' },
					{ label: __('75%', 'mpv'), value: '0.75' },
					{ label: __('100%', 'mpv'), value: '1' },
					{ label: __('125%', 'mpv'), value: '1.25' },
					{ label: __('150%', 'mpv'), value: '1.5' },
					{ label: __('200%', 'mpv'), value: '2' },
					{ label: __('300%', 'mpv'), value: '3' },
					{ label: __('400%', 'mpv'), value: '4' },
				] }
				onChange={updateAttribute('zoomLevel')}				
			/>	
			</div>

		</PanelBody>

		<PanelBody title={__('PDF Page Number', 'mpv')} initialOpen={ false }>
			<div>
				<TextControl
						type="number"
						label={__('Default Landing Page', 'mpv')}
						value={undefined === defaultLandingPage ? "1" : defaultLandingPage}
						min={1}
						onChange={updateAttribute('defaultLandingPage')}
					/>
			</div>
		</PanelBody>

		<PanelBody title={__('Page View Mode', 'mpv')} initialOpen={ false }>
		<div>
			<SelectControl
				label={__('Page View Mode', 'mpv')}
				value={pageViewMode}
				options={ [
					{ label: __('Vertical Scrolling', 'mpv'), value: '0' },
					{ label: __('Horizontal Scrolling', 'mpv'), value: '1' },
					{ label: __('Wrapped Scrolling', 'mpv'), value: '2' },
					{ label: __('Page Scrolling', 'mpv'), value: '3' }
				] }
				onChange={updateAttribute('pageViewMode')}				
			/>
			</div>
		</PanelBody>
</InspectorControls>

		<div 
		{ ...useBlockProps() }
		>
			{ getIframeUrl() && 
			<div className="mpv_pdf_wrapper" style={{height: height+"px", width:  width.includes("%")?width:width+"px"  }}
			>
				<iframe allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock" src={getIframeUrl(attributes)} title="pdf-viewer"  
    width="100%"
    height="100%"
    className="pdf_iframe"></iframe></div> }
		{
			! isSelected && <div style={{display:"block", position:"absolute", width:"100%", height:"100%", background:"transparent", top:"0px", zIndex:"100"}}></div>
		}
		{ isSelected &&	<MediaPlaceholder
				labels={{
					title: __('Master PDF Viewer updated', 'mpv'),
					instructions: __('Drag a PDF, upload a new one or select a PDF from your library.', 'mpv'),
				}}
				onSelect={onUpdateMedia}
				onSelectURL={
					updateAttribute("file")
				}
				// notices={props.noticeUI}
				// onError={props.noticeOperations.createErrorNotice}
				accept='application/pdf'
				allowedTypes={['application/pdf']}
			/>
}
		</div>
		</>

	);
}
