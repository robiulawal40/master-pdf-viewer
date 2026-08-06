<?php
/**
 * Plugin Name:       Master PDF Viewer
 * Description:       Immediately embed PDF into the posts and pages on your website. Your PDF files will automatically resize to their proper dimensions.
 * Requires at least: 5.0
 * Requires PHP:      6.0
 * Version:           0.0.3
 * Author:            robiulawal40, fuad40
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       master-pdf-viewer
 * Domain Path:       mpv
 *
 * @package           mpv
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'Master_PDF_Viewer_Gutenberg_Blocks' ) ) :

	final class Master_PDF_Viewer_Gutenberg_Blocks {

		/*
		 * @var mixed
		 */
		private static $instance;

		/*
		 * instance functions
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new Master_PDF_Viewer_Gutenberg_Blocks();
			}
			return self::$instance;
		}

		/*
		 * Cloning is forbidden.
		 */
		public function __clone() {
			_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'nvce' ), '1.0' );
		}

		/*
		 * Unserializing instances of this class is forbidden.
		 */
		public function __wakeup() {
			_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'nvce' ), '1.0' );
		}

		/*
		 * Plugin constructor
		 */
		function __construct() {
			$this->text_domain = 'mpv';
			$this->set_constants();
			$this->includes();
			add_action( 'init', array( $this, 'scripts' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}

		/*
		 * Setting the plugin  constant
		 */
		public function set_constants() {

			if ( ! defined( 'MVP_VERSION' ) ) {
				define( 'MVP_VERSION', '0.1.0' );
			}

			if ( ! defined( 'MVP_DOMAIN' ) ) {
				define( 'MVP_DOMAIN', 'mpv' );
			}
			if ( ! defined( 'MVPDIR' ) ) {
				define( 'MVPDIR', plugin_dir_path( __FILE__ ) );
			}
			if ( ! defined( 'MVPBASENAME' ) ) {
				define( 'MVPBASENAME', plugin_basename( __FILE__ ) );
			}
			if ( ! defined( 'MVPURL' ) ) {
				define( 'MVPURL', plugin_dir_url( __FILE__ ) );
			}
		}

		public function scripts() {

				register_block_type( plugin_dir_path( __FILE__ ) . 'build' );
		}

		public function enqueue_scripts() {

			wp_register_script( 'pdf-js-worker', MVPURL . 'pdf-js/build/pdf.worker.js', array(), MVP_VERSION, true );
			wp_register_script( 'pdf-js-lib', MVPURL . 'pdf-js/build/pdf.js', array('pdf-js-worker'), MVP_VERSION, true );
		}

		/*
		 * Plugin include files
		 */
		public function includes() {
			require_once MVPDIR . 'functions.php';
		}
	}
endif;

function MVP_init() {
	return Master_PDF_Viewer_Gutenberg_Blocks::instance();
}
add_action( 'plugins_loaded', 'MVP_init' );
