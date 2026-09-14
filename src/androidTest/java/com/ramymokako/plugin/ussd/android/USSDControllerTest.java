package com.ramymokako.plugin.ussd.android;

import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

/**
 * Unit tests for the pure-Java validation logic in {@link USSDController}.
 *
 * <p>These tests run on a plain JVM (JUnit4) and deliberately avoid the
 * Android framework: they exercise {@link USSDController#validateDialUpArguments}
 * which is the argument-validation front door of {@code dialUp()}.</p>
 */
public class USSDControllerTest {

    private static HashMap<String, HashSet<String>> validMap() {
        HashMap<String, HashSet<String>> map = new HashMap<>();
        map.put("KEY_LOGIN", new HashSet<>(Arrays.asList("espere", "waiting", "loading", "esperando")));
        map.put("KEY_ERROR", new HashSet<>(Arrays.asList("problema", "problem", "error", "null")));
        return map;
    }

    @Test
    public void dialUp_acceptsValidArguments() {
        assertNull(USSDController.validateDialUpArguments("*105#", validMap()));
    }

    @Test
    public void dialUp_rejectsNullMap() {
        assertEquals("Bad Mapping structure",
                USSDController.validateDialUpArguments("*105#", null));
    }

    @Test
    public void dialUp_rejectsMapWithoutLoginKey() {
        HashMap<String, HashSet<String>> map = new HashMap<>();
        map.put("KEY_ERROR", new HashSet<>(Arrays.asList("error")));
        assertEquals("Bad Mapping structure",
                USSDController.validateDialUpArguments("*105#", map));
    }

    @Test
    public void dialUp_rejectsMapWithoutErrorKey() {
        HashMap<String, HashSet<String>> map = new HashMap<>();
        map.put("KEY_LOGIN", new HashSet<>(Arrays.asList("waiting")));
        assertEquals("Bad Mapping structure",
                USSDController.validateDialUpArguments("*105#", map));
    }

    @Test
    public void dialUp_rejectsNullUssdNumber() {
        assertEquals("Bad ussd number",
                USSDController.validateDialUpArguments(null, validMap()));
    }

    @Test
    public void dialUp_rejectsEmptyUssdNumber() {
        assertEquals("Bad ussd number",
                USSDController.validateDialUpArguments("", validMap()));
    }
}