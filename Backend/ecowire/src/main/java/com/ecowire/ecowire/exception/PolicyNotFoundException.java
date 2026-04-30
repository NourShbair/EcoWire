package com.ecowire.ecowire.exception;

public class PolicyNotFoundException extends RuntimeException {
    public PolicyNotFoundException(String policyId) {
        super("Policy not found with id: " + policyId);
    }
}
