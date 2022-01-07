<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'twp_wp' );

/** MySQL database username */
define( 'DB_USER', 'jeff' );

/** MySQL database password */
define( 'DB_PASSWORD', 'jeff' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '6u!r+GZ0fyQFo]3?WcHR&$|r{v$0zue,@KwKGjmbVlKUo*QPpchzpYWGk_,w{a:t' );
define( 'SECURE_AUTH_KEY',  'XcsnF9G NK_#;ECRW8b4fKM3=0%e }+8Kj$b62r9m94zgz_;9^iqE{IQc7{B,g(s' );
define( 'LOGGED_IN_KEY',    's[QIFrbd_hs_4R~MjlBA`i2FR5{z`OVZM?kQXyHcN9%<FTpm]vo Wo1;Qh3de-bg' );
define( 'NONCE_KEY',        'UC=emh8]}=?osL@+.1f*Y9l Aw0*9jl2E//levXF5#tx}?=AW2V.!_D RN0hMTTs' );
define( 'AUTH_SALT',        'yIT%nCsj2Ec_HW.glb`xN<QR)!_}j=z;M1Csu$A/C|&lEJXDDF%ce*EZKe/#MvFH' );
define( 'SECURE_AUTH_SALT', '>q8CA#0w_NG6MYp7|6x|~A~p>e:xFsAJ:{fWmp$L]~{I.Z$@{!=,oE5wCffsAx09' );
define( 'LOGGED_IN_SALT',   'Suz<h6clrK:*%Le.D4T1_X=115@_$W5;R,ojkw0esvsI2[h}8`DkE4%=R=J-BIn}' );
define( 'NONCE_SALT',       'FeorYA=$,oE>?/8L#CdkgflTB>2RaJ<&o`,l0aEeSLAzBG=oj<Ign&[COQPGINDL' );

define('JWT_AUTH_SECRET_KEY', 'my-top-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
