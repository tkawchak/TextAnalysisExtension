// <copyright file="MissingPropertyException.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProcessTextFunc.Exceptions
{
    using System;

    [Serializable]
    public class MissingPropertyException : Exception
    {
        public MissingPropertyException() : base() { }

        public MissingPropertyException(string message) : base(message) { }

        public MissingPropertyException(string message, Exception inner) : base(message, inner) { }

        // A constructor is needed for serialization when an
        // exception propagates from a remoting server to the client.
        protected MissingPropertyException(
            System.Runtime.Serialization.SerializationInfo info,
            System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}