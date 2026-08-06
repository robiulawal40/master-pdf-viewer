<?php
function MVP_sanitize_text_or_array_field( $array_or_string ) {

	if ( is_string( $array_or_string ) ) {
		$array_or_string = sanitize_text_field( $array_or_string );
	} elseif ( is_array( $array_or_string ) ) {
		foreach ( $array_or_string as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = MVP_sanitize_text_or_array_field( $value );
			} else {
				$value = sanitize_text_field( $value );
			}
		}
	}
	return $array_or_string;
}

function mpv_process_attributes( $attributes ) {
	$str = '';
	if ( is_array( $attributes ) ) {
		foreach ( $attributes as $key => $value ) {
			if ( is_string( $key ) && is_string( $value ) ) {
				$str .= " $key='$value'";
			}
		}
	}
	return $str;
}

function mpv_pdf_viewer_block( $attributes ) {

	$attrs = $attributes;

	if ( isset( $attrs['file'] ) && ! empty( $attrs['file'] ) ) {
		if ( strpos( $attrs['file'], 'http' ) !== 0 ) {
			$attrs['file'] = site_url( $attrs['file'] );
		}
	}

	$settings = build_query( $attrs );

	$result = '<div class="mpv_pdf_wrapper" ' . esc_html( mpv_process_attributes( $attributes )) . ' >';

	if(isset($attributes['file']) && $settings){
	$result .= '
  <iframe allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock" src="' . esc_html( MVPURL) . 'pdf-js/web/viewer.html?' .esc_html($settings) . '" title="pdf-viewer"  style="opacity: 1; z-index: 1; user-select: initial; pointer-events: initial; border: 10px #b10000;" 
    width="100%"
    height="100%"
    class="pdf_iframe"></iframe>
  ';
	}
	$result .= '</div>';

	$height = '400px';
	if ( isset( $attributes['height'] ) && strpos( $attributes['height'], '%' ) > -1 ) {
		$height = $attributes['height'];
	} elseif ( isset( $attributes['height'] ) ) {
		$height = $attributes['height'] . 'px';
	}

	$width = '100%';
	if ( isset( $attributes['width'] ) && strpos( $attributes['width'], '%' ) > -1 ) {
		$width = $attributes['width'];
	} elseif ( isset( $attributes['width'] ) ) {
		$width = $attributes['width'] . 'px';
	}

	$result .= '    
  <style>
  .mpv_pdf_wrapper{
    height:' . esc_html($height) . ';
    width:' . esc_html($width) . ';
  }
  </style>';

	return $result;
}




function mpv_pdf_viewer_init() {
	register_block_type_from_metadata(
		plugin_dir_path( __FILE__ ) . 'build',
		array(
			'render_callback' => 'mpv_pdf_viewer_block',
		)
	);
}
	add_action( 'init', 'mpv_pdf_viewer_init' );
