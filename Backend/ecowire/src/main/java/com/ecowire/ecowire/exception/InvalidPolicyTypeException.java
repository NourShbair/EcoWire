package com.ecowire.ecowire.exception;

public class InvalidPolicyTypeException extends RuntimeException {

    public InvalidPolicyTypeException(String policyType) {
        super("Invalid policy type: " + policyType
                + ". Valid options: AUTO, HOME, PROPERTY");
    }

    public InvalidPolicyTypeException(String message, boolean custom) {
        super(message);
    }
}
