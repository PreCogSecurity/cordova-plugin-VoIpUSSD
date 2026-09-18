package com.ramymokako.plugin.ussd.android;

import android.util.Log;

/**
 * Centralized logging for the VoIpUSSD plugin.
 *
 * All log output goes through this class so it can be tuned (or disabled)
 * in a single place. Messages are tagged consistently with the plugin name
 * and never contain sensitive data such as full USSD responses.
 */
public final class USSDLog {

    private static final String TAG = "VoIpUSSD";

    private USSDLog() {
        // utility class, not instantiable
    }

    public static void d(String message) {
        Log.d(TAG, message);
    }

    public static void e(String message) {
        Log.e(TAG, message);
    }
}
